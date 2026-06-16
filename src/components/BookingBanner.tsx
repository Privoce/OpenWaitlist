import { CALENDLY_URL } from "@/lib/site";

export function BookingBanner({
  variant = "admin",
}: {
  variant?: "admin" | "kiosk";
}) {
  const isKiosk = variant === "kiosk";

  return (
    <div
      className={
        isKiosk
          ? "border-b border-brand-primary/20 bg-brand-gold-light/80 px-4 py-2.5 text-center text-xs text-brand-dark/90 sm:text-sm"
          : "border-b border-brand-primary/20 bg-brand-primary px-4 py-3 text-center text-sm text-white sm:px-6"
      }
    >
      <span className={isKiosk ? "text-brand-dark/80" : "text-white/90"}>
        Testing OpenWaitlist?
      </span>{" "}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isKiosk
            ? "font-semibold text-brand-primary underline underline-offset-2 hover:text-brand-primary-dark"
            : "font-semibold underline underline-offset-2 hover:text-brand-gold"
        }
      >
        Book a meeting with us
      </a>{" "}
      <span className={isKiosk ? "text-brand-dark/70" : "text-white/80"}>
        to deploy at your restaurant.
      </span>
    </div>
  );
}
