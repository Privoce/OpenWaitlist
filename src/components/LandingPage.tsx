import Link from "next/link";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";
import { GITHUB_REPO_URL, LIVE_APP_URL, SITE_DOMAIN } from "@/lib/site";

const features = [
  {
    title: "Customer kiosk",
    description:
      "A touch-friendly iPad screen for guests to join the waitlist — name, phone, party size, done.",
  },
  {
    title: "Staff admin",
    description:
      "Search, filter, and manage the queue. Notify guests, check them in, seat parties, or cancel.",
  },
  {
    title: "SMS notifications",
    description:
      "Automatic texts when guests join and when their table is ready, powered by Telnyx.",
  },
  {
    title: "Open source",
    description:
      "Self-host on Vercel with Turso, or run locally. No vendor lock-in, full control of your data.",
  },
];

const steps = [
  {
    step: "1",
    title: "Guest joins",
    description: "They tap the kiosk, enter their details, and get a ticket number.",
  },
  {
    step: "2",
    title: "Staff manages",
    description: "Your team tracks the queue, sends table-ready texts, and seats parties.",
  },
  {
    step: "3",
    title: "Guest returns",
    description: "They get an SMS when it's their turn and show their number to the host.",
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
              Try demo
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <p className="mb-4 inline-flex rounded-full border border-brand-primary/20 bg-brand-gold-light/50 px-4 py-1 text-sm font-medium text-brand-primary">
              Open source · Restaurant waitlist
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Waitlist management that{" "}
              <span className="text-brand-primary">just works</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark/70 sm:text-xl">
              OpenWaitlist is a free, self-hostable waitlist app for restaurants — customer
              kiosk, staff dashboard, and SMS alerts. Built by{" "}
              <a
                href="https://privoce.com"
                className="font-medium text-brand-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privoce
              </a>
              .
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/kiosk/"
                className="rounded-full bg-brand-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-dark transition-colors"
              >
                Try the demo
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
              Interactive demo runs in your browser.{" "}
              <a
                href={LIVE_APP_URL}
                className="text-brand-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Full deployment
              </a>{" "}
              with database and SMS available on Vercel.
            </p>
          </div>
        </section>

        <section className="border-y border-brand-gold-light bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight">Everything you need</h2>
            <p className="mt-3 max-w-2xl text-brand-dark/70">
              From the host stand to the guest&apos;s phone — one simple stack, no monthly SaaS fee.
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

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
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
            <h2 className="text-3xl font-semibold tracking-tight">Ready to try it?</h2>
            <p className="mt-4 max-w-xl text-white/85">
              Explore the kiosk and staff admin in your browser, or deploy your own instance in
              minutes with Vercel and Turso.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kiosk/"
                className="rounded-full bg-brand-gold px-8 py-3.5 font-semibold text-brand-dark hover:bg-brand-gold/90 transition-colors"
              >
                Open kiosk demo
              </Link>
              <Link
                href="/admin/waitlist/"
                className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Open staff admin
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-gold-light px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <OpenWaitlistLogo className="text-lg" />
            <p className="mt-2 text-sm text-brand-dark/50">
              Open source waitlist software ·{" "}
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
            <a
              href={LIVE_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark/70 hover:text-brand-primary"
            >
              Live app
            </a>
            <a
              href="https://privoce.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark/70 hover:text-brand-primary"
            >
              Privoce
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
