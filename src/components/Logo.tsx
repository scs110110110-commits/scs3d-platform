interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HEIGHTS = {
  sm: "h-9 max-w-[10.5rem]",
  md: "h-11 max-w-[13rem]",
  lg: "h-16 max-w-[18rem]",
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
