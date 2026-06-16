"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { AddWaitlistModal } from "@/components/AddWaitlistModal";
import { AdminBookingBanner } from "@/components/AdminBookingBanner";
import { DemoSessionNotice } from "@/components/DemoSessionNotice";
import { GuestMessagePanel } from "@/components/GuestMessagePanel";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";
import { WaitlistCard } from "@/components/WaitlistCard";
import { PageSpinner } from "@/components/ui/PageSpinner";
import { usePolling } from "@/hooks/usePolling";
import {
  createWaitlistEntry,
  fetchAllEntries,
  patchWaitlistStatus,
} from "@/lib/data-access";
import {
  DEMO_SMS_LIMIT_MESSAGE,
  incrementSessionSmsCount,
  isDemoNoticeDismissed,
  isSessionSmsLimitReached,
} from "@/lib/demo-limits";
import type { WaitlistEntry, WaitlistSource } from "@/lib/types";

type Tab = "waitlist" | "seated" | "history";

function WaitlistPageContent() {
  const searchParams = useSearchParams();
  const defaultSource = (searchParams.get("source") as WaitlistSource) ?? "staff";

  const [tab, setTab] = useState<Tab>("waitlist");
  const [search, setSearch] = useState("");
  const [partyFilter, setPartyFilter] = useState<"all" | "1-2" | "3-4" | "5+">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [messageEntry, setMessageEntry] = useState<WaitlistEntry | null>(null);
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const openMessagePanel = useCallback((entry: WaitlistEntry) => {
    setMessageEntry({ ...entry, unread_message_count: 0 });
  }, []);

  const recordSessionSms = useCallback(() => {
    const count = incrementSessionSmsCount();
    if (count >= 1 && !isDemoNoticeDismissed()) {
      setShowDemoNotice(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    const entries = await fetchAllEntries([
      "waiting",
      "notified",
      "checked_in",
      "seated",
      "cancelled",
    ]);
    return { entries };
  }, []);

  const { data, refresh } = usePolling(fetchData, 3000);
  const entries = data?.entries ?? [];

  const filteredEntries = useMemo(() => {
    let list = entries;

    if (tab === "waitlist") {
      list = list.filter((e) =>
        ["waiting", "notified", "checked_in"].includes(e.status),
      );
    } else if (tab === "seated") {
      list = list.filter((e) => e.status === "seated");
    } else {
      list = list.filter((e) => ["seated", "cancelled"].includes(e.status));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.ticket_number.toLowerCase().includes(q),
      );
    }

    if (partyFilter === "1-2") list = list.filter((e) => e.party_size <= 2);
    else if (partyFilter === "3-4")
      list = list.filter((e) => e.party_size >= 3 && e.party_size <= 4);
    else if (partyFilter === "5+") list = list.filter((e) => e.party_size >= 5);

    return list;
  }, [entries, tab, search, partyFilter]);

  const tabEntries = useMemo(() => {
    if (tab === "waitlist") {
      return entries.filter((e) =>
        ["waiting", "notified", "checked_in"].includes(e.status),
      );
    }
    if (tab === "seated") {
      return entries.filter((e) => e.status === "seated");
    }
    return entries.filter((e) => ["seated", "cancelled"].includes(e.status));
  }, [entries, tab]);

  const partyCount = (size: "all" | "1-2" | "3-4" | "5+") => {
    if (size === "all") return tabEntries.length;
    if (size === "1-2") return tabEntries.filter((e) => e.party_size <= 2).length;
    if (size === "3-4")
      return tabEntries.filter((e) => e.party_size >= 3 && e.party_size <= 4).length;
    return tabEntries.filter((e) => e.party_size >= 5).length;
  };

  const updateStatus = async (id: string, status: WaitlistEntry["status"]) => {
    setActionError(null);
    const entry = entries.find((item) => item.id === id);

    if (status === "notified" && entry?.sms_opt_in && entry.phone) {
      if (isSessionSmsLimitReached()) {
        setActionError(DEMO_SMS_LIMIT_MESSAGE);
        return;
      }
    }

    const updated = await patchWaitlistStatus(id, status);
    if (!updated) {
      setActionError("Could not update this entry.");
      return;
    }

    if (status === "notified" && updated.sms_opt_in && updated.phone) {
      recordSessionSms();
    }

    refresh();
  };

  const handleAdd = async (formData: {
    name: string;
    phone: string;
    party_size: number;
    child_count: number;
    notes: string;
    source: WaitlistSource;
  }) => {
    await createWaitlistEntry({
      ...formData,
      source: defaultSource,
      sms_opt_in: Boolean(formData.phone?.trim()),
    });
    setShowAddModal(false);
    refresh();
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    weekday: "short",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminBookingBanner />

      <DemoSessionNotice
        visible={showDemoNotice}
        onDismiss={() => setShowDemoNotice(false)}
      />

      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <Link
          href="/"
          className="rounded-lg px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          ← Home
        </Link>
        <div className="text-center">
          <h1 className="font-semibold text-gray-900">Staff admin</h1>
          <p className="text-xs text-gray-400">Demo environment</p>
        </div>
        <OpenWaitlistLogo className="text-sm" />
      </header>

      <div className="flex flex-1 justify-center px-0 sm:px-4 sm:py-4">
        <aside className="flex w-full max-w-lg flex-col border-x border-gray-200 bg-white sm:rounded-2xl sm:border sm:shadow-sm">
          <div className="border-b border-gray-100 p-4">
            {actionError ? (
              <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {actionError}
              </p>
            ) : null}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, or ticket"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>

          <div className="flex border-b border-gray-100 text-sm">
            {(["waitlist", "seated", "history"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 capitalize transition-colors ${
                  tab === t
                    ? "border-b-2 border-brand-primary font-semibold text-brand-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 px-4 py-3 text-sm text-gray-500">
            <span>{today}</span>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "1-2", "3-4", "5+"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPartyFilter(f)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    partyFilter === f
                      ? "bg-brand-gold-light text-brand-primary-dark"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                >
                  {f === "all" ? "All" : f} · {partyCount(f)}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[320px] flex-1 overflow-y-auto">
            {filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-sm font-medium text-gray-500">No entries</p>
                <p className="mt-1 text-xs text-gray-400">
                  Add a demo party or join from the kiosk
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <WaitlistCard
                  key={entry.id}
                  entry={entry}
                  onMessage={openMessagePanel}
                  onNotify={(id) => updateStatus(id, "notified")}
                  onCheckIn={(id) => updateStatus(id, "checked_in")}
                  onSeat={(id) => updateStatus(id, "seated")}
                  onCancel={(id) => updateStatus(id, "cancelled")}
                />
              ))
            )}
          </div>

          <div className="border-t border-gray-100 p-4">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full rounded-full bg-brand-primary py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-dark"
            >
              + Add demo party
            </button>
          </div>
        </aside>
      </div>

      <AddWaitlistModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        source={defaultSource}
      />

      {messageEntry ? (
        <GuestMessagePanel
          entry={messageEntry}
          onClose={() => setMessageEntry(null)}
          onSmsSent={recordSessionSms}
          onMessagesRead={refresh}
        />
      ) : null}
    </div>
  );
}

export default function AdminWaitlistPage() {
  return (
    <Suspense fallback={<PageSpinner label="Loading admin..." />}>
      <WaitlistPageContent />
    </Suspense>
  );
}
