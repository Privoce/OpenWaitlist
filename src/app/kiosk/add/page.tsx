"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPhone } from "@/lib/format";
import {
  createWaitlistEntry,
  fetchWaitlistCount,
} from "@/lib/data-access";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";

export default function KioskAddPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [childCount, setChildCount] = useState("");
  const [activeField, setActiveField] = useState<"phone" | "party" | "child">("phone");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    fetchWaitlistCount().then(setWaitlistCount);
  }, []);

  useInactivityTimeout(() => router.push("/kiosk/"), 60_000);

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
    const value = field === "party" ? partySize : childCount;
    const setter = field === "party" ? setPartySize : setChildCount;
    if (key === "back") {
      setter(value.slice(0, -1));
      return;
    }
    if (value.length < 2) {
      setter(value + key);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a 10-digit phone number.");
      setActiveField("phone");
      return;
    }
    if (!partySize || parseInt(partySize, 10) < 1) {
      setError("Please enter your party size.");
      setActiveField("party");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createWaitlistEntry({
        name: name.trim(),
        phone,
        party_size: parseInt(partySize, 10),
        child_count: childCount ? parseInt(childCount, 10) : 0,
        source: "kiosk",
      });

      if (!result.ok || !result.entry) {
        setError(result.error ?? "Could not join waitlist. Please try again.");
        return;
      }

      router.push(
        `/kiosk/success/?name=${encodeURIComponent(result.entry.name)}&ticket=${encodeURIComponent(result.entry.ticket_number)}&token=${encodeURIComponent(result.entry.public_token)}`,
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const keypadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"] as const;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            router.push(waitlistCount === 0 ? "/kiosk/" : "/kiosk/join/")
          }
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          ← Back
        </button>
      </div>

      <div className="px-6 pt-2 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Add to waitlist</h1>
      </div>

      <div className="px-6 space-y-5 flex-1 overflow-y-auto">
        <div>
          <label className="text-sm text-gray-500">
            Customer name<span className="text-brand-primary">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border-b border-gray-200 py-3 text-xl outline-none focus:border-brand-primary"
            placeholder="Enter name"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Phone number<span className="text-brand-primary">*</span>
          </label>
          <button
            type="button"
            onClick={() => setActiveField("phone")}
            className={`mt-1 w-full border-b py-3 text-xl text-left outline-none ${
              activeField === "phone" ? "border-brand-primary" : "border-gray-200"
            }`}
          >
            {phone || "Tap below to enter phone"}
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
              className={`mt-1 w-full border-b py-3 text-xl text-left outline-none ${
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
              className={`mt-1 w-full border-b py-3 text-xl text-left outline-none ${
                activeField === "child" ? "border-brand-primary" : "border-gray-200"
              }`}
            >
              {childCount || "—"}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 border-t border-gray-200">
        {keypadKeys.map((key) => {
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

      <div className="p-6 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-full bg-brand-primary py-5 text-xl font-medium text-white shadow-lg disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add to waitlist"}
        </button>
      </div>
    </div>
  );
}
