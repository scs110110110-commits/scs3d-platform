interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const HEIGHTS = {
  sm: "h-16 max-w-[18rem]",
  md: "h-20 max-w-[22rem]",
  lg: "h-24 max-w-[28rem]",
  xl: "h-[5.25rem] max-w-[min(100%,26rem)] sm:h-28 sm:max-w-[30rem] md:h-[7.5rem] md:max-w-[34rem]",
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
