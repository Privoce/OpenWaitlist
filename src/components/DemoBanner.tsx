import Link from "next/link";

export function DemoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "border-b border-brand-gold/30 bg-brand-gold-light/60 px-4 py-2.5 text-center text-xs text-brand-dark/80"
          : "border-b border-brand-gold/30 bg-brand-gold-light/60 px-6 py-3 text-center text-sm text-brand-dark/80"
      }
    >
      <strong className="text-brand-dark">Product demo</strong> — for restaurant operators
      evaluating OpenWaitlist.{" "}
      <Link
        href="/"
        className="font-medium text-brand-primary underline underline-offset-2 hover:text-brand-primary-dark"
      >
        Learn more
      </Link>
    </div>
  );
}
