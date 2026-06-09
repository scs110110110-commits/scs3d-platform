"use client";

import { useCallback, useState } from "react";

interface FileDropzoneProps {
  accept: string;
  label: string;
  hint: string;
  icon: string;
  onFile: (file: File) => void;
  currentFile?: File | null;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
}

export default function FileDropzone({
  accept,
  label,
  hint,
  icon,
  onFile,
  currentFile,
  multiple,
  onFiles,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (multiple && onFiles) {
        onFiles(Array.from(files));
      } else {
        onFile(files[0]);
      }
    },
    [multiple, onFile, onFiles]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition ${
        isDragging
          ? "border-cyan-400 bg-cyan-500/10"
          : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-500 hover:bg-zinc-800/60"
      }`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="mb-3 text-4xl" aria-hidden="true">
        {icon}
      </span>
      <span className="mb-1 text-lg font-medium text-white">{label}</span>
      <span className="text-sm text-zinc-500">{hint}</span>
      {currentFile && (
        <span className="mt-4 rounded-lg bg-zinc-700/80 px-3 py-1.5 text-sm text-cyan-300">
          {currentFile.name}
        </span>
      )}
    </label>
  );
}
