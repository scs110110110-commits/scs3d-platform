interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HEIGHTS = {
  sm: "h-14 max-w-[16rem]",
  md: "h-16 max-w-[18rem]",
  lg: "h-[5.5rem] max-w-[24rem]",
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
