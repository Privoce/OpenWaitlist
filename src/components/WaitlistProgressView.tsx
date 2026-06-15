"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND_NAME, DEMO_TAGLINE } from "@/lib/brand";
import { fetchWaitlistProgress } from "@/lib/data-access";
import type { WaitlistProgress } from "@/lib/types";
import { DemoBanner } from "@/components/DemoBanner";
import { PoweredBy } from "@/components/OpenWaitlistLogo";
import { PageSpinner } from "@/components/ui/PageSpinner";

export function WaitlistProgressView({ token }: { token: string }) {
  const [progress, setProgress] = useState<WaitlistProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const data = await fetchWaitlistProgress(token);
      if (!active) return;

      if (!data) {
        setNotFound(true);
        setProgress(null);
      } else {
        setNotFound(false);
        setProgress(data);
      }
      setLoading(false);
    }

    void load();
    const timer = setInterval(() => {
      void load();
    }, 20_000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [token]);

  if (loading) {
    return <PageSpinner label="Loading status..." />;
  }

  if (notFound || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DemoBanner compact />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-semibold text-brand-dark">Waitlist not found</h1>
          <p className="mt-3 max-w-sm text-brand-dark/70">
            This link may have expired or the demo entry was removed.
          </p>
          <Link
            href="/kiosk/"
            className="mt-6 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-dark"
          >
            Try the demo
          </Link>
        </div>
      </div>
    );
  }

  const isReady = progress.status === "notified";
  const isDone = progress.status === "seated" || progress.status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DemoBanner compact />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <p className="text-sm text-gray-500">
          {BRAND_NAME} · {DEMO_TAGLINE}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-brand-dark text-center">
          {progress.status_message}
        </h1>
        <p className="mt-2 text-brand-dark/70">Hi {progress.guest_name}</p>

        <div className="mt-8 w-full max-w-sm rounded-3xl border border-brand-primary/10 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Your ticket
          </p>
          <p className="mt-2 text-5xl font-bold text-brand-primary tabular-nums">
            {progress.ticket_number}
          </p>

          {!isDone && progress.position !== null && (
            <>
              <div className="mt-8 border-t border-brand-gold-light pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Place in line
                </p>
                <p className="mt-2 text-4xl font-semibold text-brand-dark tabular-nums">
                  #{progress.position}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-2xl bg-brand-gold-light/50 px-4 py-3">
                  <p className="text-xs text-gray-500">Party size</p>
                  <p className="mt-1 text-lg font-semibold text-brand-dark">
                    {progress.party_size}
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-gold-light/50 px-4 py-3">
                  <p className="text-xs text-gray-500">Waiting</p>
                  <p className="mt-1 text-lg font-semibold text-brand-dark">
                    {progress.wait_time}
                  </p>
                </div>
              </div>

              {progress.parties_ahead > 0 && !isReady && (
                <p className="mt-6 text-sm text-gray-500">
                  {progress.parties_ahead} part
                  {progress.parties_ahead === 1 ? "y" : "ies"} ahead in the demo queue
                </p>
              )}
            </>
          )}

          {isReady && (
            <p className="mt-8 text-base font-medium text-brand-green">
              Demo: show this ticket to continue the table-ready flow.
            </p>
          )}

          {isDone && (
            <p className="mt-8 text-brand-dark/70">
              {progress.status === "seated"
                ? "This demo party has been seated."
                : "This demo entry is no longer active."}
            </p>
          )}
        </div>

        {!isDone && (
          <p className="mt-6 max-w-sm text-center text-sm text-gray-400">
            This page refreshes automatically. In the demo, you may also receive a sample
            SMS when staff taps Notify.
          </p>
        )}
      </div>

      <div className="pb-8 flex justify-center">
        <PoweredBy variant="light" />
      </div>
    </div>
  );
}
