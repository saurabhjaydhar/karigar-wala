export function BackgroundBubbles({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute -left-24 -top-24 size-72 rounded-full bg-brand-navy-400/20 blur-3xl animate-float-slow" />
      <div className="absolute -right-20 top-1/3 size-80 rounded-full bg-brand-orange-400/20 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/4 size-56 rounded-full bg-brand-navy-300/10 blur-3xl animate-float-slow" />
    </div>
  );
}
