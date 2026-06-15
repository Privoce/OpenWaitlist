import type { Metadata } from "next";
import { SAMPLE_WAITLIST_TOKEN } from "@/lib/demo-progress";
import { WaitlistProgressView } from "@/components/WaitlistProgressView";

export const metadata: Metadata = {
  title: "Waitlist Status — OpenWaitlist Demo",
  description: "Check your place in the OpenWaitlist product demo queue.",
};

export function generateStaticParams() {
  return [{ token: SAMPLE_WAITLIST_TOKEN }];
}

export default async function WaitlistProgressPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <WaitlistProgressView token={token} />;
}
