"use client";

import { formatWaitTime } from "@/lib/format";
import type { WaitlistEntry } from "@/lib/types";

interface WaitlistCardProps {
  entry: WaitlistEntry;
  onNotify: (id: string) => void;
  onCheckIn: (id: string) => void;
  onSeat: (id: string) => void;
  onCancel: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  waiting: "bg-gray-100 text-gray-600",
  notified: "bg-brand-gold-light text-brand-primary-dark",
  checked_in: "bg-brand-green-light text-brand-green",
  seated: "bg-brand-green-light text-brand-green",
  cancelled: "bg-red-50 text-red-700",
};

export function WaitlistCard({
  entry,
  onNotify,
  onCheckIn,
  onSeat,
  onCancel,
}: WaitlistCardProps) {
  const isActive = ["waiting", "notified", "checked_in"].includes(entry.status);
  const statusLabel = entry.status.replace("_", " ");

  return (
    <div className="border-b border-gray-100 px-4 py-4 hover:bg-gray-50/80 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-brand-primary/10 px-2.5 py-1 text-sm font-bold text-brand-primary tabular-nums">
              {entry.ticket_number}
            </span>
            <h3 className="truncate font-semibold text-gray-900">{entry.name}</h3>
          </div>
          {entry.phone ? (
            <p className="mt-1 text-sm text-gray-500">{entry.phone}</p>
          ) : (
            <p className="mt-1 text-sm italic text-gray-400">No phone</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {entry.party_size}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[entry.status] ?? statusStyles.waiting}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span>{formatWaitTime(entry.created_at)}</span>
        <span>·</span>
        <span className="capitalize">{entry.source.replace("_", " ")}</span>
      </div>

      {isActive && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNotify(entry.id)}
            className="rounded-full bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-gold/90"
          >
            Notify
          </button>
          <button
            type="button"
            onClick={() => onCheckIn(entry.id)}
            className="rounded-full border border-brand-primary/20 bg-white px-4 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-gold-light/40"
          >
            Check in
          </button>
          <button
            type="button"
            onClick={() => onSeat(entry.id)}
            className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
          >
            Seat
          </button>
          <button
            type="button"
            onClick={() => onCancel(entry.id)}
            className="ml-auto rounded-full px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Cancel entry"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
