"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  KioskError,
  KioskFieldLabel,
  KioskFooter,
  KioskKeypad,
  KioskPrimaryButton,
  KioskShell,
  KioskTapField,
  KioskTextInput,
  KioskTitle,
  KioskTopBar,
} from "@/components/kiosk/KioskChrome";
import {
  createWaitlistEntry,
  fetchWaitlistCount,
} from "@/lib/data-access";
import { formatPhone } from "@/lib/format";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { PRIVACY_URL, TERMS_URL, smsOptInLabel } from "@/lib/sms-consent";

export default function KioskAddPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [childCount, setChildCount] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [activeField, setActiveField] = useState<"phone" | "party" | "child">("party");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    fetchWaitlistCount().then(setWaitlistCount);
  }, []);

  useInactivityTimeout(() => router.push("/kiosk/"), 60_000);

  const handleKey = (key: string) => {
    if (activeField === "phone") {
      const digits = phone.replace(/\D/g, "");
      if (key === "back") setPhone(formatPhone(digits.slice(0, -1)));
      else if (digits.length < 10) setPhone(formatPhone(digits + key));
      return;
    }

    const value = activeField === "party" ? partySize : childCount;
    const setter = activeField === "party" ? setPartySize : setChildCount;
    if (key === "back") setter(value.slice(0, -1));
    else if (value.length < 2) setter(value + key);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!partySize || parseInt(partySize, 10) < 1) {
      setError("Please enter your party size.");
      setActiveField("party");
      return;
    }
    if (smsOptIn && phone.replace(/\D/g, "").length < 10) {
      setError("Enter a 10-digit phone number to receive SMS updates.");
      setActiveField("phone");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createWaitlistEntry({
        name: name.trim(),
        phone: smsOptIn ? phone : "",
        party_size: parseInt(partySize, 10),
        child_count: childCount ? parseInt(childCount, 10) : 0,
        source: "kiosk",
        sms_opt_in: smsOptIn,
      });

      if (!result.ok || !result.entry) {
        setError(result.error ?? "Could not join waitlist. Please try again.");
        return;
      }

      router.push(
        `/kiosk/success/?name=${encodeURIComponent(result.entry.name)}&ticket=${encodeURIComponent(result.entry.ticket_number)}&token=${encodeURIComponent(result.entry.public_token)}&sms=${result.entry.sms_opt_in ? "1" : "0"}`,
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KioskShell>
      <KioskTopBar
        onBack={() =>
          router.push(waitlistCount === 0 ? "/kiosk/" : "/kiosk/join/")
        }
      />
      <KioskTitle title="Add to demo waitlist" />

      <div className="flex-1 overflow-y-auto px-6">
        <div className="mx-auto max-w-md space-y-5">
          <div>
            <KioskFieldLabel required>Your name</KioskFieldLabel>
            <KioskTextInput
              value={name}
              onChange={setName}
              placeholder="Enter name"
              autoFocus
            />
          </div>

          <div>
            <KioskFieldLabel>Phone (optional)</KioskFieldLabel>
            <KioskTapField
              active={activeField === "phone"}
              disabled={!smsOptIn}
              onClick={() => setActiveField("phone")}
              placeholder="Only needed if you opt in to SMS below"
            >
              {phone}
            </KioskTapField>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-brand-gold-light bg-white p-4 shadow-sm">
            <input
              type="checkbox"
              checked={smsOptIn}
              onChange={(e) => {
                setSmsOptIn(e.target.checked);
                if (e.target.checked) setActiveField("phone");
              }}
              className="mt-1 h-5 w-5 shrink-0 accent-brand-primary"
            />
            <span className="text-sm leading-relaxed text-brand-dark/80">
              {smsOptInLabel()}{" "}
              <Link href={PRIVACY_URL} className="text-brand-primary underline">
                Privacy
              </Link>
              {" · "}
              <Link href={TERMS_URL} className="text-brand-primary underline">
                Terms
              </Link>
            </span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <KioskFieldLabel required>Party size</KioskFieldLabel>
              <KioskTapField
                active={activeField === "party"}
                onClick={() => setActiveField("party")}
                placeholder="—"
              >
                {partySize}
              </KioskTapField>
            </div>
            <div>
              <KioskFieldLabel>Children</KioskFieldLabel>
              <KioskTapField
                active={activeField === "child"}
                onClick={() => setActiveField("child")}
                placeholder="0"
              >
                {childCount}
              </KioskTapField>
            </div>
          </div>
        </div>
      </div>

      {error ? <KioskError message={error} /> : null}

      <KioskKeypad onKey={handleKey} />

      <KioskFooter showPoweredBy={false}>
        <KioskPrimaryButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Adding..." : "Add to demo waitlist"}
        </KioskPrimaryButton>
      </KioskFooter>
    </KioskShell>
  );
}
