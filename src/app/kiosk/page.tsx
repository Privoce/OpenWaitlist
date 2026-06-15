"use client";

import { useRouter } from "next/navigation";
import { BRAND_NAME, DEMO_TAGLINE } from "@/lib/brand";
import { fetchWaitlistCount } from "@/lib/data-access";
import { PoweredBy } from "@/components/OpenWaitlistLogo";
import { DemoBanner } from "@/components/DemoBanner";

export default function KioskLandingPage() {
  const router = useRouter();

  const handleStart = async () => {
    const count = await fetchWaitlistCount();
    router.push(count === 0 ? "/kiosk/add/" : "/kiosk/join/");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <DemoBanner compact />
      <button
        type="button"
        onClick={handleStart}
        className="relative flex flex-1 w-full flex-col items-center justify-center bg-brand-primary px-8 text-white cursor-pointer select-none transition-opacity active:opacity-95"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-gold/20 blur-2xl" />

        <div className="relative text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-white/70">
            {BRAND_NAME}
          </p>
          <p className="mt-3 text-base text-white/85">{DEMO_TAGLINE}</p>
          <h1 className="mt-10 text-5xl font-bold tracking-tight sm:text-6xl">
            Try the demo
          </h1>
          <p className="mt-5 text-lg text-white/80">Tap anywhere to start</p>
          <p className="mt-8 inline-flex rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm text-white/90">
            Kiosk · Staff admin · Sample SMS
          </p>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <PoweredBy />
        </div>
      </button>
    </div>
  );
}
