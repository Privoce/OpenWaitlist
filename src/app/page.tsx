import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "OpenWaitlist — Live product demo",
  description:
    "Hands-on demo of OpenWaitlist for restaurant operators. Try the guest kiosk, staff admin, and sample SMS notifications before you deploy.",
  openGraph: {
    title: "OpenWaitlist — Live product demo",
    description: "Try the open-source restaurant waitlist app before you deploy.",
    siteName: "OpenWaitlist",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
