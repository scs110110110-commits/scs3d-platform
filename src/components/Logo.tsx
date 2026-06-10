interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HEIGHTS = {
  sm: "h-12 max-w-[14rem]",
  md: "h-14 max-w-[16rem]",
  lg: "h-20 max-w-[22rem]",
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/scs3d-logo.png"
      alt="SCS3D — 3D Design & Printing Services"
      className={`w-auto object-contain object-left ${HEIGHTS[size]} ${className}`}
    />
  );
}
