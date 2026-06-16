import { CALENDLY_URL } from "@/lib/site";

export function AdminBookingBanner() {
  return (
    <div className="border-b border-brand-primary/20 bg-brand-primary px-4 py-3 text-center text-sm text-white sm:px-6">
      <span className="text-white/90">Testing OpenWaitlist?</span>{" "}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline underline-offset-2 hover:text-brand-gold"
      >
        Book a meeting with us
      </a>{" "}
      <span className="text-white/80">to deploy at your restaurant.</span>
    </div>
  );
}
