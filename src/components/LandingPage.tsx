import Link from "next/link";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";
import {
  CALENDLY_URL,
  GITHUB_REPO_URL,
  LIVE_APP_URL,
  SAMPLE_WAITLIST_URL,
  SITE_DOMAIN,
} from "@/lib/site";
import { CopySampleLinkButton } from "@/components/CopySampleLinkButton";
import { SAMPLE_WAITLIST_TOKEN } from "@/lib/demo-progress";

const features = [
  {
    title: "Guest kiosk",
    description:
      "Walk through the touch-friendly iPad flow your guests would use — name, optional SMS opt-in, party size.",
  },
  {
    title: "Staff admin",
    description:
      "See how hosts search the queue, notify guests, check them in, seat parties, and cancel entries.",
  },
  {
    title: "SMS & progress links",
    description:
      "Opt in with your own phone number to receive sample queue and table-ready texts, plus a private progress link.",
  },
  {
    title: "Deploy when ready",
    description:
      "Self-host for free on Vercel or run on-premise. Privoce can help with installation, 10DLC setup, and support.",
  },
];

const steps = [
  {
    step: "1",
    title: "Try the kiosk",
    description:
      "Open the live demo, add a sample party, and optionally test SMS with your phone number.",
  },
  {
    step: "2",
    title: "Manage the queue",
    description:
      "Open staff admin to notify, check in, and seat demo entries like your team would.",
  },
  {
    step: "3",
    title: "Deploy for real",
    description:
      "When you're ready, deploy your own instance with your restaurant's branding and 10DLC registration.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fffaf5] text-brand-dark">
      <header className="sticky top-0 z-10 border-b border-brand-gold-light/80 bg-[#fffaf5]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <OpenWaitlistLogo className="text-xl" />
          <nav className="flex items-center gap-3 sm:gap-6">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm text-brand-dark/70 hover:text-brand-primary sm:inline"
            >
              GitHub
            </a>
            <Link
              href="/kiosk/"
              className="rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-dark transition-colors"
            >
              Open live demo
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <p className="mb-4 inline-flex rounded-full border border-amber-300/60 bg-amber-50 px-4 py-1 text-sm font-medium text-amber-900">
              Live product demo · for restaurant operators
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Try OpenWaitlist{" "}
              <span className="text-brand-primary">before you deploy</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/70 sm:text-xl">
              This site is a hands-on demo of OpenWaitlist — the open-source waitlist app
              for restaurants. Walk through the guest kiosk, staff dashboard, and optional
              SMS flow. When you&apos;re ready to go live at your location,{" "}
              <a
                href={CALENDLY_URL}
                className="font-medium text-brand-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                book a call
              </a>{" "}
              for deployment and 10DLC setup.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/kiosk/"
                className="rounded-full bg-brand-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-dark transition-colors"
              >
                Start the demo
              </Link>
              <Link
                href="/admin/waitlist/"
                className="rounded-full border border-brand-dark/15 bg-white px-8 py-3.5 text-base font-semibold text-brand-dark hover:border-brand-primary/30 hover:bg-brand-gold-light/30 transition-colors"
              >
                Open staff admin
              </Link>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-dark/15 bg-white px-8 py-3.5 text-base font-semibold text-brand-dark hover:border-brand-primary/30 hover:bg-brand-gold-light/30 transition-colors"
              >
                View on GitHub
              </a>
            </div>

            <p className="mt-6 text-sm text-brand-dark/50">
              Demo URL:{" "}
              <a
                href={LIVE_APP_URL}
                className="text-brand-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE_DOMAIN}
              </a>
              . SMS in the demo is sent by <strong>OpenWaitlist</strong> only — not on
              behalf of a third-party restaurant. Production deployments use your own
              brand and 10DLC campaign.
            </p>
          </div>
        </section>

        <section className="border-y border-brand-gold-light bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight">What you can try</h2>
            <p className="mt-3 max-w-2xl text-brand-dark/70">
              Everything on this demo is sample data for evaluation. No real guests are
              being seated.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-brand-gold-light bg-[#fffaf5] p-6"
                >
                  <h3 className="text-lg font-semibold text-brand-dark">{feature.title}</h3>
                  <p className="mt-2 leading-relaxed text-brand-dark/70">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 bg-white border-y border-brand-gold-light">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Sample guest progress link
            </h2>
            <p className="mt-3 max-w-2xl text-brand-dark/70">
              In production, guests receive a private link by SMS. Here&apos;s a fixed
              sample so you can see the experience without joining the demo queue.
            </p>

            <div className="mt-8 rounded-2xl border border-brand-gold-light bg-[#fffaf5] p-5 sm:p-6">
              <p className="text-sm font-medium text-brand-dark/60">Sample link</p>
              <a
                href={SAMPLE_WAITLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all font-mono text-sm text-brand-primary hover:underline sm:text-base"
              >
                {SAMPLE_WAITLIST_URL}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/p/waitlist/${SAMPLE_WAITLIST_TOKEN}/`}
                  className="rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-dark transition-colors"
                >
                  Open sample
                </Link>
                <CopySampleLinkButton url={SAMPLE_WAITLIST_URL} />
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-brand-gold-light bg-white shadow-sm">
              <div className="border-b border-brand-gold-light px-4 py-3 text-sm text-brand-dark/60">
                Live preview
              </div>
              <iframe
                title="Waitlist progress sample"
                src={`/p/waitlist/${SAMPLE_WAITLIST_TOKEN}/`}
                className="h-[520px] w-full border-0 bg-brand-gold-light/20"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight">How the demo works</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-brand-dark/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl rounded-3xl bg-brand-primary px-8 py-12 text-white sm:px-12 sm:py-16">
            <h2 className="text-3xl font-semibold tracking-tight">Ready to deploy at your restaurant?</h2>
            <p className="mt-4 max-w-xl text-white/85">
              Use this demo to evaluate OpenWaitlist. When you want your own instance with
              your branding, database, and 10DLC-registered SMS, we can help with setup.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kiosk/"
                className="rounded-full bg-brand-gold px-8 py-3.5 font-semibold text-brand-dark hover:bg-brand-gold/90 transition-colors"
              >
                Continue demo
              </Link>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Book a deployment call
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-gold-light px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <OpenWaitlistLogo className="text-lg" />
            <p className="mt-2 text-sm text-brand-dark/50">
              Product demo · Open source by Privoce ·{" "}
              <span className="text-brand-dark/70">{SITE_DOMAIN}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark/70 hover:text-brand-primary"
            >
              GitHub
            </a>
            <Link href="/kiosk/" className="text-brand-dark/70 hover:text-brand-primary">
              Live demo
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark/70 hover:text-brand-primary"
            >
              Book a call
            </a>
            <a
              href="https://privoce.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark/70 hover:text-brand-primary"
            >
              Privoce
            </a>
            <Link href="/privacy/" className="text-brand-dark/70 hover:text-brand-primary">
              Privacy
            </Link>
            <Link href="/terms/" className="text-brand-dark/70 hover:text-brand-primary">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
