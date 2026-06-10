"use client";

import { useEffect, useState } from "react";
import { fetchWaitlistProgress } from "@/lib/data-access";
import type { WaitlistProgress } from "@/lib/types";
import { PoweredBy } from "@/components/OpenWaitlistLogo";

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
    return (
      <div className="min-h-screen bg-brand-gold-light/30 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin-slow" />
      </div>
    );
  }

  if (notFound || !progress) {
    return (
      <div className="min-h-screen bg-brand-gold-light/30 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-brand-dark">Waitlist not found</h1>
        <p className="mt-3 text-brand-dark/70">
          This link may have expired or the entry was removed.
        </p>
      </div>
    );
  }

  const isReady = progress.status === "notified";
  const isDone = progress.status === "seated" || progress.status === "cancelled";

  return (
    <div className="min-h-screen bg-brand-gold-light/30 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <p className="text-brand-dark/60 text-sm mb-2">{progress.restaurant_name}</p>
        <h1 className="text-2xl font-semibold text-brand-dark text-center">
          {progress.status_message}
        </h1>
        <p className="mt-2 text-brand-dark/70">Hi {progress.guest_name}</p>

        <div className="mt-10 w-full max-w-sm rounded-3xl bg-white border border-brand-primary/15 shadow-lg p-8 text-center">
          <p className="text-sm text-brand-dark/60">Your number</p>
          <p className="mt-2 text-5xl font-bold text-brand-primary">
            {progress.ticket_number}
          </p>

          {!isDone && progress.position !== null && (
            <>
              <div className="mt-8 border-t border-brand-gold-light pt-6">
                <p className="text-sm text-brand-dark/60">Your place in line</p>
                <p className="mt-2 text-4xl font-semibold text-brand-dark">
                  #{progress.position}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                <div className="rounded-2xl bg-brand-gold-light/40 px-4 py-3">
                  <p className="text-xs text-brand-dark/60">Party size</p>
                  <p className="mt-1 font-semibold text-brand-dark">
                    {progress.party_size}
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-gold-light/40 px-4 py-3">
                  <p className="text-xs text-brand-dark/60">Waiting</p>
                  <p className="mt-1 font-semibold text-brand-dark">
                    {progress.wait_time}
                  </p>
                </div>
              </div>

              {progress.parties_ahead > 0 && !isReady && (
                <p className="mt-6 text-sm text-brand-dark/60">
                  {progress.parties_ahead} part
                  {progress.parties_ahead === 1 ? "y" : "ies"} ahead of you
                </p>
              )}
            </>
          )}

          {isReady && (
            <p className="mt-8 text-lg font-medium text-brand-green">
              Please show this number to the host when you arrive.
            </p>
          )}

          {isDone && (
            <p className="mt-8 text-brand-dark/70">
              {progress.status === "seated"
                ? "Enjoy your meal!"
                : "This waitlist entry is no longer active."}
            </p>
          )}
        </div>

        {!isDone && (
          <p className="mt-8 text-sm text-brand-dark/50 text-center max-w-sm">
            This page updates automatically. You&apos;ll also get a text when your
            table is ready.
          </p>
        )}
      </div>

      <div className="pb-8 flex justify-center">
        <PoweredBy />
      </div>
    </div>
  );
}
