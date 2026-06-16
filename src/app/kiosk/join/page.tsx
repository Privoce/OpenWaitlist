"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BRAND_NAME, DEMO_TAGLINE } from "@/lib/brand";
import {
  KioskFooter,
  KioskPrimaryButton,
  KioskShell,
  KioskTopBar,
} from "@/components/kiosk/KioskChrome";
import { PageSpinner } from "@/components/ui/PageSpinner";
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
    return <PageSpinner label="Loading waitlist..." />;
  }

  return (
    <KioskShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <KioskTopBar onBack={() => router.push("/kiosk/")} />

        <div className="shrink-0 px-6 pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Demo waitlist</h1>
              <p className="mt-0.5 text-xs text-gray-500">
                {BRAND_NAME} · {DEMO_TAGLINE}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-primary/15 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-3xl font-semibold text-brand-primary tabular-nums">{count}</p>
              <p className="text-xs text-gray-500">
                {count === 1 ? "waiting" : "waiting"}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3">
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-[5.5rem_1fr_3.5rem] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <span>Ticket</span>
                <span>Name</span>
                <span className="text-right">Party</span>
              </div>

              <div className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[5.5rem_1fr_3.5rem] gap-3 px-4 py-3 text-gray-800"
                  >
                    <span className="font-semibold text-brand-primary tabular-nums">
                      {entry.ticket_number}
                    </span>
                    <span className="truncate">{entry.name}</span>
                    <span className="text-right tabular-nums text-gray-600">{entry.party_size}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-2 text-center text-xs text-gray-400">
              Prefix <span className="font-medium text-gray-500">{prefix}</span>
            </p>
          </div>
        </div>

        <KioskFooter showPoweredBy={false}>
          <KioskPrimaryButton onClick={() => router.push("/kiosk/add/")}>
            Add to demo waitlist
          </KioskPrimaryButton>
        </KioskFooter>
      </div>
    </KioskShell>
  );
}
