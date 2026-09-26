import PageViewTracker from "@/components/analytics/PageViewTracker";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-grain relative flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <PageViewTracker />
      <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
