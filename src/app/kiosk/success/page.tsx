"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BRAND_NAME, DEMO_TAGLINE } from "@/lib/brand";
import { BookingBanner } from "@/components/BookingBanner";
import { PoweredBy } from "@/components/OpenWaitlistLogo";
import { PageSpinner } from "@/components/ui/PageSpinner";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") ?? "Guest";
  const ticket = params.get("ticket") ?? "---";
  const token = params.get("token");
  const smsOptIn = params.get("sms") === "1";
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) router.push("/kiosk/");
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BookingBanner variant="kiosk" />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-sm text-gray-500">
          {BRAND_NAME} · {DEMO_TAGLINE}
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-gray-900">You&apos;re on the demo list</h1>
        <p className="mt-2 text-lg text-gray-600">Hi {name}</p>

        <div className="relative mt-10 w-44 rounded-[2rem] border-4 border-brand-primary/20 bg-white px-6 py-16 shadow-lg">
          <div className="absolute left-1/2 top-4 h-1.5 w-12 -translate-x-1/2 rounded-full bg-gray-200" />
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Ticket</p>
          <p className="mt-2 text-5xl font-bold text-brand-primary tabular-nums">{ticket}</p>
        </div>

        <p className="mt-8 max-w-sm text-sm text-gray-500">
          {smsOptIn
            ? "Check your phone for a sample SMS. Staff can notify you from the admin demo."
            : "Open staff admin to try notifying this party, or show this ticket in the demo flow."}
        </p>

        {token ? (
          <Link
            href={`/p/waitlist/${token}/`}
            className="mt-6 text-sm font-medium text-brand-primary underline underline-offset-4 hover:text-brand-primary-dark"
          >
            View your progress link
          </Link>
        ) : null}
      </div>

      <div className="rounded-t-[2rem] bg-brand-primary px-6 pb-10 pt-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => router.push("/kiosk/")}
          className="mx-auto block w-full max-w-md rounded-full bg-brand-gold px-8 py-4 text-lg font-semibold text-brand-dark shadow-md transition-colors hover:bg-brand-gold/90"
        >
          Done ({countdown}s)
        </button>
        <div className="mt-6 flex justify-center">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}

export default function KioskSuccessPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}
