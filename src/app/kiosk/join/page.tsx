"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fetchActiveWaitlist, fetchSettings } from "@/lib/data-access";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { usePolling } from "@/hooks/usePolling";
import type { WaitlistEntry } from "@/lib/types";

interface WaitlistResponse {
  entries: WaitlistEntry[];
  count: number;
}

export default function KioskJoinPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<{ restaurant_name: string; ticket_prefix: string } | null>(null);

  const fetchData = useCallback(async () => {
    const [waitlist, s] = await Promise.all([
      fetchActiveWaitlist(),
      fetchSettings(),
    ]);
    setSettings(s);
    return waitlist as WaitlistResponse;
  }, []);

  const { data, loading } = usePolling(fetchData, 3000);

  useEffect(() => {
    if (!loading && data?.count === 0) {
      router.replace("/kiosk/add/");
    }
  }, [loading, data, router]);

  useInactivityTimeout(() => router.push("/kiosk/"), 30_000);

  const entries = data?.entries ?? [];
  const count = data?.count ?? 0;
  const prefix = settings?.ticket_prefix ?? "SE";

  if (loading || count === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-6">
        <button
          type="button"
          onClick={() => router.push("/kiosk/")}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-lg"
        >
          ← Back
        </button>
      </div>

      <header className="pt-4 pb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Join Waitlist</h1>
        <p className="text-sm text-gray-400 mt-2">{prefix}(1-8)</p>
        <p className="text-6xl font-light text-brand-primary mt-2">{count}</p>
      </header>

      <div className="flex-1 px-8">
        <div className="grid grid-cols-3 text-sm text-gray-400 mb-4 px-2">
          <span>Waitlist Number</span>
          <span className="text-center">Name</span>
          <span className="text-right">Party Size</span>
        </div>

        <div className="space-y-5">
          {entries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-3 text-lg text-gray-600 px-2">
              <span>{entry.ticket_number}</span>
              <span className="text-center">{entry.name}</span>
              <span className="text-right">{entry.party_size}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 pb-12">
        <button
          type="button"
          onClick={() => router.push("/kiosk/add/")}
          className="w-full rounded-full bg-brand-primary py-5 text-xl font-medium text-white shadow-lg active:scale-[0.99] transition-transform"
        >
          Add to waitlist
        </button>
      </div>
    </div>
  );
}
