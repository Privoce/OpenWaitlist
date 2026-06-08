export function OpenWaitlistLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      <span className="text-brand-primary">Open</span>
      <span className="text-gray-800">Waitlist</span>
    </span>
  );
}

export function PoweredBy() {
  return (
    <p className="text-xs text-brand-gold-light/80">
      powered by <span className="font-medium text-white">OpenWaitlist</span>
    </p>
  );
}
