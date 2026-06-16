"use client";

import { useState } from "react";
import { formatPhone } from "@/lib/format";
import type { WaitlistSource } from "@/lib/types";

interface AddWaitlistModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    party_size: number;
    child_count: number;
    notes: string;
    source: WaitlistSource;
  }) => Promise<void>;
  source?: WaitlistSource;
  kioskMode?: boolean;
}

export function AddWaitlistModal({
  open,
  onClose,
  onSubmit,
  source = "kiosk",
  kioskMode = false,
}: AddWaitlistModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [childCount, setChildCount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<"phone" | "party" | "child" | null>(
    null,
  );

  if (!open) return null;

  const handlePhoneKey = (key: string) => {
    const digits = phone.replace(/\D/g, "");
    if (key === "back") {
      setPhone(formatPhone(digits.slice(0, -1)));
      return;
    }
    if (digits.length < 10) {
      setPhone(formatPhone(digits + key));
    }
  };

  const handleNumberKey = (key: string, field: "party" | "child") => {
    const setter = field === "party" ? setPartySize : setChildCount;
    const value = field === "party" ? partySize : childCount;
    if (key === "back") {
      setter(value.slice(0, -1));
      return;
    }
    if (value.length < 2) {
      setter(value + key);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter customer name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a 10-digit phone number.");
      return;
    }
    if (!partySize) {
      setError("Please enter party size.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        phone,
        party_size: parseInt(partySize, 10),
        child_count: childCount ? parseInt(childCount, 10) : 0,
        notes: notes.trim(),
        source,
      });
      setName("");
      setPhone("");
      setPartySize("");
      setChildCount("");
      setNotes("");
      setActiveField(null);
    } finally {
      setSubmitting(false);
    }
  };

  const keypad = (
    <div className="grid grid-cols-3 gap-2 border-t border-gray-200 bg-gray-100 p-4">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].map((key) => {
        if (key === "") return <div key="empty" />;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (activeField === "phone") handlePhoneKey(key === "back" ? "back" : key);
              else if (activeField === "party")
                handleNumberKey(key === "back" ? "back" : key, "party");
              else if (activeField === "child")
                handleNumberKey(key === "back" ? "back" : key, "child");
            }}
            className={`h-12 rounded-xl text-lg font-medium ${
              key === "back"
                ? "bg-brand-primary text-white"
                : "bg-white text-gray-800 shadow-sm"
            }`}
          >
            {key === "back" ? "⌫" : key}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-2xl ${
          kioskMode ? "max-w-2xl rounded-t-2xl sm:rounded-2xl" : "max-w-md rounded-2xl"
        }`}
      >
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Add demo party</h2>
          <p className="mt-1 text-sm text-gray-500">For staff admin demo only</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Name<span className="text-brand-primary"> *</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                placeholder="Guest name"
                autoFocus={!kioskMode}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone<span className="text-brand-primary"> *</span>
              </label>
              {kioskMode ? (
                <button
                  type="button"
                  onClick={() => setActiveField("phone")}
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-left text-base outline-none ${
                    activeField === "phone"
                      ? "border-brand-primary ring-2 ring-brand-primary/10"
                      : "border-gray-200"
                  }`}
                >
                  {phone || "Tap to enter phone"}
                </button>
              ) : (
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(formatPhone(digits));
                  }}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                  placeholder="Phone number"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Party size<span className="text-brand-primary"> *</span>
                </label>
                {kioskMode ? (
                  <button
                    type="button"
                    onClick={() => setActiveField("party")}
                    className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-left text-base outline-none ${
                      activeField === "party"
                        ? "border-brand-primary ring-2 ring-brand-primary/10"
                        : "border-gray-200"
                    }`}
                  >
                    {partySize || "—"}
                  </button>
                ) : (
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                    placeholder="2"
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Children</label>
                {kioskMode ? (
                  <button
                    type="button"
                    onClick={() => setActiveField("child")}
                    className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-left text-base outline-none ${
                      activeField === "child"
                        ? "border-brand-primary ring-2 ring-brand-primary/10"
                        : "border-gray-200"
                    }`}
                  >
                    {childCount || "0"}
                  </button>
                ) : (
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={childCount}
                    onChange={(e) => setChildCount(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                    placeholder="0"
                  />
                )}
              </div>
            </div>

            {!kioskMode && (
              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                  placeholder="Optional"
                />
              </div>
            )}
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 rounded-full bg-brand-primary py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add party"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {kioskMode && activeField && keypad}
      </div>
    </div>
  );
}
