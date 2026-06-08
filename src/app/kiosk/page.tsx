"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSettings, fetchWaitlistCount } from "@/lib/data-access";
import { PoweredBy } from "@/components/OpenWaitlistLogo";

export default function KioskLandingPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    fetchSettings().then((s) => setRestaurantName(s.restaurant_name));
  }, []);

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
      <p className="text-lg mb-8 opacity-90">{restaurantName}</p>
      <h1 className="text-5xl font-bold mb-4">Join waitlist</h1>
      <p className="text-lg opacity-80">Tap anywhere to start</p>
      <div className="absolute bottom-8 left-8">
        <PoweredBy />
      </div>
    </button>
  );
}
