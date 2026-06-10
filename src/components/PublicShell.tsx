import BackgroundLogo from "@/components/BackgroundLogo";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <BackgroundLogo />
      <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
