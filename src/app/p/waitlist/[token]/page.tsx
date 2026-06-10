import type { Metadata } from "next";
import { WaitlistProgressView } from "@/components/WaitlistProgressView";

export const metadata: Metadata = {
  title: "Waitlist Status — OpenWaitlist",
  description: "Check your place in the restaurant waitlist.",
};

export function generateStaticParams() {
  return [{ token: "preview" }];
}

export default async function WaitlistProgressPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <WaitlistProgressView token={token} />;
}
