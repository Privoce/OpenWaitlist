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
    <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].map((key) => {
        if (key === "") {
          return <div key="empty" />;
        }
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
            className={`h-14 rounded-lg text-xl font-medium ${
              key === "back"
                ? "bg-brand-primary text-white"
                : "bg-white text-gray-800 shadow-sm active:bg-gray-50"
            }`}
          >
            {key === "back" ? "⌫" : key}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div
        className={`bg-white w-full shadow-2xl ${
          kioskMode ? "max-w-2xl rounded-t-2xl sm:rounded-2xl" : "max-w-md rounded-2xl mx-4"
        }`}
      >
        <div className="p-6 pb-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add to waitlist</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">
                Customer name<span className="text-brand-primary">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border-b border-gray-200 py-2 text-lg outline-none focus:border-brand-primary"
                placeholder="Enter name"
                autoFocus={!kioskMode}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Phone number<span className="text-brand-primary">*</span>
              </label>
              <button
                type="button"
                onClick={() => setActiveField("phone")}
                className={`mt-1 w-full border-b py-2 text-lg text-left outline-none ${
                  activeField === "phone" ? "border-brand-primary" : "border-gray-200"
                }`}
              >
                {phone || "Tap to enter phone"}
              </button>
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="text-sm text-gray-500">
                  Party size<span className="text-brand-primary">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveField("party")}
                  className={`mt-1 w-full border-b py-2 text-lg text-left outline-none ${
                    activeField === "party" ? "border-brand-primary" : "border-gray-200"
                  }`}
                >
                  {partySize || "—"}
                </button>
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-500">Child</label>
                <button
                  type="button"
                  onClick={() => setActiveField("child")}
                  className={`mt-1 w-full border-b py-2 text-lg text-left outline-none ${
                    activeField === "child" ? "border-brand-primary" : "border-gray-200"
                  }`}
                >
                  {childCount || "—"}
                </button>
              </div>
            </div>

            {!kioskMode && (
              <div>
                <label className="text-sm text-gray-500">Notes</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full border-b border-gray-200 py-2 text-lg outline-none focus:border-brand-primary"
                  placeholder="Optional notes"
                />
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</p>
          )}

          <div className="flex gap-3 py-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full bg-brand-primary px-8 py-3 text-white font-medium disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add to waitlist"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-8 py-3 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>

        {kioskMode && activeField && keypad}
      </div>
    </div>
  );
}
