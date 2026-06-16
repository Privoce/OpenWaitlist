"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEMO_SMS_LIMIT_MESSAGE,
  isSessionSmsLimitReached,
  MAX_DEMO_SMS_PER_GUEST,
} from "@/lib/demo-limits";
import type { SmsMessage, WaitlistEntry } from "@/lib/types";

const SMS_CHAR_LIMIT = 320;
const POLL_INTERVAL_MS = 4000;

function formatMessageTime(iso: string) {
  const normalized = iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusBadge(status: WaitlistEntry["status"]) {
  const labels: Record<WaitlistEntry["status"], string> = {
    waiting: "Wait",
    notified: "Ready",
    checked_in: "In",
    seated: "Seated",
    cancelled: "Cancelled",
  };
  return labels[status];
}

function deliveryLabel(status: SmsMessage["status"]) {
  if (status === "delivered") return "Delivered";
  if (status === "failed") return "Failed";
  if (status === "received") return "Received";
  return "Sent";
}

export function GuestMessagePanel({
  entry,
  onClose,
  onSmsSent,
  onMessagesRead,
}: {
  entry: WaitlistEntry;
  onClose: () => void;
  onSmsSent?: () => void;
  onMessagesRead?: () => void;
}) {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/waitlist/${entry.id}/messages`);
    if (!res.ok) {
      setError("Could not load messages.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoading(false);
    void fetch(`/api/waitlist/${entry.id}/messages/read`, { method: "POST" }).then(
      () => onMessagesRead?.(),
    );
  }, [entry.id, onMessagesRead]);

  useEffect(() => {
    void loadMessages();
    const interval = setInterval(() => {
      void loadMessages();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const outboundCount = messages.filter((message) => message.direction === "outbound").length;

  async function handleSend() {
    setError(null);

    if (isSessionSmsLimitReached()) {
      setError(DEMO_SMS_LIMIT_MESSAGE);
      return;
    }

    if (outboundCount >= MAX_DEMO_SMS_PER_GUEST) {
      setError(`Demo limit: maximum ${MAX_DEMO_SMS_PER_GUEST} messages per guest.`);
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/waitlist/${entry.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send SMS.");
        return;
      }
      setMessages(data.messages ?? []);
      setReply("");
      onSmsSent?.();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const guestLimitReached = outboundCount >= MAX_DEMO_SMS_PER_GUEST;
  const sessionLimitReached = isSessionSmsLimitReached();
  const canSend =
    Boolean(entry.phone?.trim()) &&
    entry.sms_opt_in &&
    reply.trim().length > 0 &&
    !sending &&
    !guestLimitReached &&
    !sessionLimitReached;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close message panel"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chat with {entry.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-green-light px-2.5 py-0.5 text-xs font-semibold text-brand-green">
                {statusBadge(entry.status)}
              </span>
              <span className="text-sm text-gray-500">{entry.ticket_number}</span>
              {entry.phone ? (
                <span className="text-sm text-gray-500">{entry.phone}</span>
              ) : (
                <span className="text-sm italic text-gray-400">No phone</span>
              )}
              {!entry.sms_opt_in && entry.phone ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  No SMS opt-in
                </span>
              ) : null}
              <span className="text-xs text-gray-400">
                {outboundCount}/{MAX_DEMO_SMS_PER_GUEST} sent
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-5">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin-slow rounded-full border-2 border-brand-primary border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500">
              <p>No messages yet.</p>
              <p className="mt-1 text-gray-400">
                Automated texts and guest replies appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isInbound = message.direction === "inbound";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isInbound ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm text-gray-800 shadow-sm ${
                        isInbound
                          ? "rounded-bl-md bg-white ring-1 ring-gray-200"
                          : "rounded-br-md bg-sky-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.body}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold ${
                            isInbound
                              ? "bg-gray-100 text-gray-700"
                              : "bg-sky-200/80 text-sky-900"
                          }`}
                        >
                          {isInbound ? "Guest" : "SMS"}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 font-semibold ${
                            message.status === "delivered" || message.status === "received"
                              ? "bg-brand-green-light text-brand-green"
                              : message.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {deliveryLabel(message.status)}
                        </span>
                        <span className="text-gray-500">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Reply</span>
            <span className="text-gray-400">
              {reply.length}/{SMS_CHAR_LIMIT} used
            </span>
          </div>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value.slice(0, SMS_CHAR_LIMIT))}
            placeholder={
              !entry.phone
                ? "Add a phone number to send SMS."
                : !entry.sms_opt_in
                  ? "Guest has not opted in to SMS — they can join the kiosk to enable replies."
                  : "Type a message to send via SMS..."
            }
            disabled={!entry.phone || !entry.sms_opt_in}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 disabled:bg-gray-50 disabled:text-gray-400"
          />

          {error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send SMS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
