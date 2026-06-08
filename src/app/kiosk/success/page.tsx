"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PoweredBy } from "@/components/OpenWaitlistLogo";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") ?? "Guest";
  const ticket = params.get("ticket") ?? "---";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/kiosk/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-brand-gold-light/30 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-12">
        <p className="text-brand-dark/70 text-lg mb-1">Hi {name}</p>
        <p className="text-brand-dark/70 text-lg mb-8">You&apos;re on the list!</p>
        <h1 className="text-2xl font-semibold text-brand-dark mb-10">
          Your waitlist number is
        </h1>

        <div className="relative w-48 h-80 border-4 border-brand-primary/25 rounded-3xl flex items-center justify-center bg-white shadow-lg">
          <div className="absolute top-3 w-16 h-1.5 bg-brand-gold-light rounded-full" />
          <span className="text-5xl font-bold text-brand-primary">{ticket}</span>
        </div>
      </div>

      <div className="bg-brand-primary rounded-t-[2.5rem] px-8 pt-10 pb-10 flex flex-col items-center shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={() => router.push("/kiosk/")}
          className="bg-brand-gold text-brand-dark rounded-full px-16 py-4 font-semibold text-lg shadow-md hover:bg-brand-gold/90 transition-colors"
        >
          Sounds Good ({countdown}s)
        </button>
        <p className="text-white text-sm mt-5 mb-4 text-center">
          We will text you when a table is ready
        </p>
        <PoweredBy />
      </div>
    </div>
  );
}

export default function KioskSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-gold-light/30" />}>
      <SuccessContent />
    </Suspense>
  );
}
