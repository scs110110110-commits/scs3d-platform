interface LogoMarkProps {
  className?: string;
}

/** Isometric 3D block with FDM layer lines */
export function LogoMark({ className = "h-6 w-6" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M24 8.5L37.5 16.25V31.75L24 39.5L10.5 31.75V16.25L24 8.5Z"
        fill="url(#scs-glow)"
        opacity="0.35"
      />
      <path d="M24 12L34 17.5V28.5L24 34L14 28.5V17.5L24 12Z" fill="#0f766e" opacity="0.5" />
      <path d="M24 12L34 17.5L24 23L14 17.5L24 12Z" fill="#34d399" />
      <path d="M14 17.5L24 23V34L14 28.5V17.5Z" fill="#0d9488" />
      <path d="M24 23L34 17.5V28.5L24 34V23Z" fill="#06b6d4" />
      <path d="M24 25.2L34 19.7" stroke="#67e8f9" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      <path d="M24 27.4L34 21.9" stroke="#67e8f9" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      <path d="M24 29.6L34 24.1" stroke="#67e8f9" strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
      <path d="M24 31.8L34 26.3" stroke="#67e8f9" strokeWidth="1.1" strokeLinecap="round" opacity="0.3" />
      <path
        d="M24 12L34 17.5L24 23L14 17.5Z"
        stroke="white"
        strokeWidth="0.6"
        strokeOpacity="0.25"
      />
      <circle cx="31" cy="15" r="2.2" fill="#a78bfa" />
      <circle cx="31" cy="15" r="1" fill="white" fillOpacity="0.9" />
      <defs>
        <radialGradient id="scs-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) scale(20)">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  title?: string;
  tagline?: string;
  taglineClassName?: string;
  className?: string;
}

const SIZES = {
  sm: { box: "h-9 w-9 rounded-xl", icon: "h-5 w-5", title: "text-sm", tag: "text-[10px]" },
  md: { box: "h-11 w-11 rounded-2xl", icon: "h-6 w-6", title: "text-[15px]", tag: "text-[11px]" },
  lg: { box: "h-14 w-14 rounded-2xl", icon: "h-8 w-8", title: "text-xl", tag: "text-xs" },
};

export default function Logo({
  size = "md",
  showText = true,
  title = "SCS3D",
  tagline = "Print Studio",
  taglineClassName,
  className = "",
}: LogoProps) {
  const s = SIZES[size];
  const taglineStyle =
    taglineClassName ??
    `font-medium uppercase tracking-[0.18em] text-zinc-500 ${s.tag}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative flex shrink-0 items-center justify-center bg-gradient-to-br from-emerald-600/20 via-cyan-600/15 to-violet-600/20 shadow-lg shadow-emerald-500/10 ring-1 ring-white/10 transition group-hover:shadow-emerald-500/25 ${s.box}`}
      >
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10" />
        <LogoMark className={`relative ${s.icon}`} />
      </div>
      {showText && (
        <div>
          <div className={`font-bold tracking-tight text-white ${s.title}`}>{title}</div>
          {tagline && <div className={taglineStyle}>{tagline}</div>}
        </div>
      )}
    </div>
  );
}
