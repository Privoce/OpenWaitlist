"use client";

import { useRouter } from "next/navigation";
import { BRAND_NAME } from "@/lib/brand";
import { fetchWaitlistCount } from "@/lib/data-access";
import { PoweredBy } from "@/components/OpenWaitlistLogo";

export default function KioskLandingPage() {
  const router = useRouter();

  const handleStart = async () => {
    const count = await fetchWaitlistCount();
    router.push(count === 0 ? "/kiosk/add/" : "/kiosk/join/");
  };

  return (
    <button
      type="button"
      onClick={handleStart}
      className="min-h-screen w-full bg-brand-primary flex flex-col items-center justify-center text-white cursor-pointer select-none active:opacity-95 transition-opacity"
    >
      <p className="text-lg mb-8 opacity-90">{BRAND_NAME}</p>
      <h1 className="text-5xl font-bold mb-4">Join waitlist</h1>
      <p className="text-lg opacity-80">Tap anywhere to start</p>
      <div className="absolute bottom-8 left-8">
        <PoweredBy />
      </div>
    </button>
  );
}
