const TELNYX_API_URL = "https://api.telnyx.com/v2/messages";

function getApiKey() {
  const key = process.env.TELNYX_API_KEY;
  if (!key) {
    throw new Error("TELNYX_API_KEY is not configured");
  }
  return key;
}

function getFromNumber() {
  const from = process.env.TELNYX_FROM_NUMBER?.trim();
  if (!from) {
    throw new Error("TELNYX_FROM_NUMBER is not configured");
  }
  return from;
}

export function isTelnyxConfigured() {
  return Boolean(process.env.TELNYX_API_KEY && process.env.TELNYX_FROM_NUMBER?.trim());
}

/** Normalize US kiosk input (10 digits or formatted) to E.164. */
export function toE164(phone: string, defaultCountryCode = "1") {
  const digits = phone.replace(/\D/g, "");

  if (phone.trim().startsWith("+")) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+${defaultCountryCode}${digits}`;
  }

  if (digits.length === 11 && digits.startsWith(defaultCountryCode)) {
    return `+${digits}`;
  }

  throw new Error(`Invalid phone number for SMS: ${phone}`);
}

export async function sendSms(to: string, text: string) {
  const response = await fetch(TELNYX_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromNumber(),
      to: toE164(to),
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Telnyx send failed (${response.status}): ${detail || response.statusText}`,
    );
  }

  const payload = (await response.json()) as {
    data?: { id?: string; to?: Array<{ phone_number?: string }> };
  };

  return {
    id: payload.data?.id,
    to: payload.data?.to?.[0]?.phone_number ?? toE164(to),
  };
}
