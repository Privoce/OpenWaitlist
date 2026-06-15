import Link from "next/link";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";
import { DemoBanner } from "@/components/DemoBanner";
import { CALENDLY_URL, SITE_DOMAIN } from "@/lib/site";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fffaf5] text-brand-dark">
      <DemoBanner />

      <header className="border-b border-brand-gold-light/80 bg-[#fffaf5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <OpenWaitlistLogo className="text-xl" />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-brand-dark/10 px-4 py-1.5 text-sm text-brand-dark/70 transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
          >
            Back to demo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium text-brand-primary">OpenWaitlist demo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-brand-dark/50">
          Last updated: June 15, 2026 · {SITE_DOMAIN}
        </p>
        <div className="prose-legal mt-8 space-y-8 text-brand-dark/80 leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="border-t border-brand-gold-light px-6 py-10 text-center text-sm text-brand-dark/50">
        <p>
          <Link href="/privacy/" className="hover:text-brand-primary">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms/" className="hover:text-brand-primary">
            Terms &amp; Conditions
          </Link>
          {" · "}
          <Link href="/kiosk/" className="hover:text-brand-primary">
            Live demo
          </Link>
          {" · "}
          <a href={CALENDLY_URL} className="hover:text-brand-primary">
            Book a call
          </a>
        </p>
      </footer>
    </div>
  );
}
