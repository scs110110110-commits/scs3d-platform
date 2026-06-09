import { unzipSync } from "fflate";
import type { ModelAnalysis, Vec3 } from "./types";

interface MeshData {
  vertices: Vec3[];
  triangles: [number, number, number][];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function computeBoundingBox(vertices: Vec3[]) {
  const mins = { x: Infinity, y: Infinity, z: Infinity };
  const maxs = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (const v of vertices) {
    mins.x = Math.min(mins.x, v.x);
    mins.y = Math.min(mins.y, v.y);
    mins.z = Math.min(mins.z, v.z);
    maxs.x = Math.max(maxs.x, v.x);
    maxs.y = Math.max(maxs.y, v.y);
    maxs.z = Math.max(maxs.z, v.z);
  }

  return {
    x: maxs.x - mins.x,
    y: maxs.y - mins.y,
    z: maxs.z - mins.z,
  };
}

function computeMeshVolume(mesh: MeshData): number {
  let volume = 0;

  for (const [i0, i1, i2] of mesh.triangles) {
    const v0 = mesh.vertices[i0];
    const v1 = mesh.vertices[i1];
    const v2 = mesh.vertices[i2];
    volume += dot(v0, cross(v1, v2)) / 6;
  }

  return Math.abs(volume);
}

function parseBinarySTL(buffer: ArrayBuffer): MeshData {
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  const vertices: Vec3[] = [];
  const triangles: [number, number, number][] = [];
  let offset = 84;

  for (let i = 0; i < triangleCount; i++) {
    offset += 12;
    const indices: number[] = [];

    for (let j = 0; j < 3; j++) {
      const x = view.getFloat32(offset, true);
      const y = view.getFloat32(offset + 4, true);
      const z = view.getFloat32(offset + 8, true);
      offset += 12;
      indices.push(vertices.length);
      vertices.push({ x, y, z });
    }

    triangles.push([indices[0], indices[1], indices[2]]);
    offset += 2;
  }

  return { vertices, triangles };
}

function parseAsciiSTL(text: string): MeshData {
  const vertices: Vec3[] = [];
  const triangles: [number, number, number][] = [];
  const vertexMap = new Map<string, number>();
  const lines = text.split("\n");
  let current: number[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("vertex")) {
      const parts = line.split(/\s+/);
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      const key = `${x},${y},${z}`;
      let idx = vertexMap.get(key);
      if (idx === undefined) {
        idx = vertices.length;
        vertexMap.set(key, idx);
        vertices.push({ x, y, z });
      }
      current.push(idx);
    } else if (line.startsWith("endfacet") && current.length === 3) {
      triangles.push([current[0], current[1], current[2]]);
      current = [];
    }
  }

  return { vertices, triangles };
}

function parseSTL(buffer: ArrayBuffer): MeshData {
  const header = new TextDecoder().decode(buffer.slice(0, 80));
  if (header.trim().toLowerCase().startsWith("solid")) {
    const text = new TextDecoder().decode(buffer);
    const facetCount = (text.match(/facet/gi) || []).length;
    if (facetCount > 0) {
      try {
        return parseAsciiSTL(text);
      } catch {
        return parseBinarySTL(buffer);
      }
    }
  }
  return parseBinarySTL(buffer);
}

function parseOBJ(text: string): MeshData {
  const positions: Vec3[] = [];
  const triangles: [number, number, number][] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const parts = line.split(/\s+/);
    const type = parts[0];

    if (type === "v") {
      positions.push({
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
        z: parseFloat(parts[3]),
      });
    } else if (type === "f") {
      const indices = parts.slice(1).map((p) => {
        const idx = parseInt(p.split("/")[0], 10);
        return idx < 0 ? positions.length + idx : idx - 1;
      });

      for (let i = 1; i < indices.length - 1; i++) {
        triangles.push([indices[0], indices[i], indices[i + 1]]);
      }
    }
  }

  return { vertices: positions, triangles };
}

function parse3MF(buffer: ArrayBuffer): MeshData {
  const bytes = new Uint8Array(buffer);
  const files = unzipSync(bytes);
  const modelFile = Object.keys(files).find(
    (name) => name.endsWith(".model") || name.endsWith("3dmodel.model")
  );

  if (!modelFile) {
    throw new Error("3MF dosyasında model bulunamadı.");
  }

  const xml = new TextDecoder().decode(files[modelFile]);
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const vertexNodes = Array.from(doc.getElementsByTagName("vertex"));
  const vertices: Vec3[] = vertexNodes.map((node) => ({
    x: parseFloat(node.getAttribute("x") || "0"),
    y: parseFloat(node.getAttribute("y") || "0"),
    z: parseFloat(node.getAttribute("z") || "0"),
  }));

  const triangles: [number, number, number][] = [];
  const triangleNodes = Array.from(doc.getElementsByTagName("triangle"));

  for (const node of triangleNodes) {
    const v1 = parseInt(node.getAttribute("v1") || "0", 10);
    const v2 = parseInt(node.getAttribute("v2") || "0", 10);
    const v3 = parseInt(node.getAttribute("v3") || "0", 10);
    triangles.push([v1, v2, v3]);
  }

  return { vertices, triangles };
}

function buildAnalysis(
  mesh: MeshData,
  fileName: string,
  fileSize: number,
  format: ModelAnalysis["format"]
): ModelAnalysis {
  if (mesh.vertices.length === 0 || mesh.triangles.length === 0) {
    throw new Error("Modelde geçerli geometri bulunamadı.");
  }

  return {
    fileName,
    fileSize,
    format,
    volumeMm3: computeMeshVolume(mesh),
    dimensions: computeBoundingBox(mesh.vertices),
    triangleCount: mesh.triangles.length,
    vertexCount: mesh.vertices.length,
  };
}

export async function analyzeModelFile(file: File): Promise<ModelAnalysis> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const buffer = await file.arrayBuffer();

  if (ext === "stl") {
    return buildAnalysis(parseSTL(buffer), file.name, file.size, "stl");
  }
  if (ext === "obj") {
    const text = new TextDecoder().decode(buffer);
    return buildAnalysis(parseOBJ(text), file.name, file.size, "obj");
  }
  if (ext === "3mf") {
    return buildAnalysis(parse3MF(buffer), file.name, file.size, "3mf");
  }

  throw new Error("Desteklenmeyen dosya formatı. Lütfen .stl, .obj veya .3mf yükleyin.");
}
