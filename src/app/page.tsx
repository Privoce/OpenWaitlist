import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "OpenWaitlist — Open-source restaurant waitlist",
  description:
    "Free, self-hostable waitlist management for restaurants. Customer kiosk, staff admin, and SMS notifications.",
  openGraph: {
    title: "OpenWaitlist",
    description: "Open-source restaurant waitlist management by Privoce.",
    siteName: "OpenWaitlist",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
