import Link from "next/link";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";
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
      <header className="border-b border-brand-gold-light/80 bg-[#fffaf5]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <OpenWaitlistLogo className="text-xl" />
          </Link>
          <Link
            href="/"
            className="text-sm text-brand-dark/70 hover:text-brand-primary"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-brand-dark/50">
          Last updated: June 10, 2026 · {SITE_DOMAIN}
        </p>
        <div className="prose-legal mt-8 space-y-6 text-brand-dark/80 leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="border-t border-brand-gold-light px-6 py-8 text-center text-sm text-brand-dark/50">
        <p>
          <Link href="/privacy/" className="hover:text-brand-primary">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms/" className="hover:text-brand-primary">
            Terms &amp; Conditions
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
