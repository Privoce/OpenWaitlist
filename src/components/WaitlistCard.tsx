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

export function WaitlistCard({
  entry,
  onNotify,
  onCheckIn,
  onSeat,
  onCancel,
}: WaitlistCardProps) {
  const isActive = ["waiting", "notified", "checked_in"].includes(entry.status);

  return (
    <div className="border-b border-gray-100 px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {entry.ticket_number} - {entry.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{entry.phone}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {entry.party_size}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
        <span>{formatWaitTime(entry.created_at)}</span>
        <span className="capitalize">{entry.source.replace("_", " ")}</span>
        {entry.status !== "waiting" && (
          <span className="text-brand-primary capitalize">{entry.status.replace("_", " ")}</span>
        )}
      </div>

      {isActive && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onNotify(entry.id)}
            className="rounded-full bg-brand-gold px-4 py-1.5 text-sm font-medium text-brand-dark"
          >
            Notify
          </button>
          <button
            onClick={() => onCheckIn(entry.id)}
            className="rounded-full bg-brand-primary px-4 py-1.5 text-sm font-medium text-white"
          >
            Check In
          </button>
          <button
            onClick={() => onSeat(entry.id)}
            className="rounded-full bg-brand-primary px-4 py-1.5 text-sm font-medium text-white"
          >
            Seat
          </button>
          <button
            onClick={() => onCancel(entry.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 p-1"
            aria-label="More options"
          >
            ⋮
          </button>
        </div>
      )}
    </div>
  );
}
