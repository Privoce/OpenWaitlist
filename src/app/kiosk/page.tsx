"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PoweredBy } from "@/components/OpenWaitlistLogo";

export default function KioskLandingPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => setRestaurantName(s.restaurant_name));
  }, []);

  const handleStart = async () => {
    const res = await fetch("/api/waitlist");
    const { count } = await res.json();
    router.push(count === 0 ? "/kiosk/add" : "/kiosk/join");
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
