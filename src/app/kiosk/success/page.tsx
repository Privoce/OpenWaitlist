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
    <div className="min-h-screen bg-brand-gold-light/30 flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-48">
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

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full text-brand-primary"
          preserveAspectRatio="none"
          style={{ height: 280 }}
        >
          <path
            fill="currentColor"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        <div className="absolute bottom-0 left-0 right-0 pb-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => router.push("/kiosk/")}
            className="bg-brand-gold text-brand-dark rounded-full px-16 py-4 font-semibold text-lg shadow-md mb-4 hover:bg-brand-gold/90 transition-colors"
          >
            Sounds Good ({countdown}s)
          </button>
          <p className="text-white/95 text-sm mb-4">
            We will text you when a table is ready
          </p>
          <PoweredBy />
        </div>
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
