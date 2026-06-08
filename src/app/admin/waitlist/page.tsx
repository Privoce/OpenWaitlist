"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { AddWaitlistModal } from "@/components/AddWaitlistModal";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";
import { WaitlistCard } from "@/components/WaitlistCard";
import { usePolling } from "@/hooks/usePolling";
import type { WaitlistEntry, WaitlistSource } from "@/lib/types";

type Tab = "waitlist" | "seated" | "history";

function WaitlistPageContent() {
  const searchParams = useSearchParams();
  const defaultSource = (searchParams.get("source") as WaitlistSource) ?? "staff";

  const [tab, setTab] = useState<Tab>("waitlist");
  const [search, setSearch] = useState("");
  const [partyFilter, setPartyFilter] = useState<"all" | "1-2" | "3-4" | "5+">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = useCallback(async () => {
    const waitlistRes = await fetch(
      "/api/waitlist?status=waiting,notified,checked_in,seated,cancelled",
    );
    const entries = (await waitlistRes.json()) as WaitlistEntry[];
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
      list = list.filter((e) =>
        ["seated", "cancelled"].includes(e.status),
      );
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
    await fetch(`/api/waitlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  };

  const handleNotify = (id: string) => updateStatus(id, "notified");
  const handleCheckIn = (id: string) => updateStatus(id, "checked_in");
  const handleSeat = (id: string) => updateStatus(id, "seated");
  const handleCancel = (id: string) => updateStatus(id, "cancelled");

  const handleAdd = async (formData: {
    name: string;
    phone: string;
    party_size: number;
    child_count: number;
    notes: string;
    source: WaitlistSource;
  }) => {
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, source: defaultSource }),
    });
    setShowAddModal(false);
    refresh();
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    weekday: "short",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <Link href="/" className="text-gray-400 hover:text-gray-600">
          ←
        </Link>
        <h1 className="font-semibold text-gray-800">Waitlist</h1>
        <OpenWaitlistLogo className="text-sm" />
      </header>

      <aside className="flex-1 max-w-lg mx-auto w-full bg-white border-x border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or phone number"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex border-b border-gray-100 text-sm">
          {(["waitlist", "seated", "history"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 capitalize ${
                tab === t
                  ? "text-brand-primary border-b-2 border-brand-primary font-medium"
                  : "text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-b border-gray-50">
          <span>{today}</span>
          <div className="flex gap-2">
            {(["all", "1-2", "3-4", "5+"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPartyFilter(f)}
                className={`px-2 py-0.5 rounded ${
                  partyFilter === f
                    ? "bg-brand-gold-light text-brand-primary-dark"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f === "all" ? "ALL" : f} ×{partyCount(f)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEntries.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No entries</p>
          ) : (
            filteredEntries.map((entry) => (
              <WaitlistCard
                key={entry.id}
                entry={entry}
                onNotify={handleNotify}
                onCheckIn={handleCheckIn}
                onSeat={handleSeat}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="m-4 rounded-full bg-brand-primary py-3 text-white font-medium text-sm"
        >
          + Add to waitlist
        </button>
      </aside>

      <AddWaitlistModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        source={defaultSource}
      />
    </div>
  );
}

export default function AdminWaitlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <WaitlistPageContent />
    </Suspense>
  );
}
