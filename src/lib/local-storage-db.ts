import type {
  CreateWaitlistInput,
  Settings,
  WaitlistEntry,
  WaitlistStatus,
} from "./types";

const ENTRIES_KEY = "openwaitlist:entries";
const SETTINGS_KEY = "openwaitlist:settings";

function readEntries(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ENTRIES_KEY) ?? "[]") as WaitlistEntry[];
  } catch {
    return [];
  }
}

function writeEntries(entries: WaitlistEntry[]) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

function readSettings(): Settings {
  if (typeof window === "undefined") {
    return { restaurant_name: "My Restaurant", ticket_prefix: "SE" };
  }
  try {
    return JSON.parse(
      localStorage.getItem(SETTINGS_KEY) ??
        '{"restaurant_name":"My Restaurant","ticket_prefix":"SE"}',
    ) as Settings;
  } catch {
    return { restaurant_name: "My Restaurant", ticket_prefix: "SE" };
  }
}

function nextTicketNumber(entries: WaitlistEntry[], prefix: string): string {
  const matching = entries
    .map((e) => e.ticket_number)
    .filter((t) => t.startsWith(prefix))
    .sort()
    .pop();

  if (!matching) return `${prefix}01`;

  const num = parseInt(matching.slice(prefix.length), 10);
  return `${prefix}${String(num + 1).padStart(2, "0")}`;
}

export function getLocalSettings(): Settings {
  return readSettings();
}

export function getLocalWaitlist(): {
  entries: WaitlistEntry[];
  count: number;
} {
  const entries = readEntries();
  const active = entries.filter((e) =>
    ["waiting", "notified", "checked_in"].includes(e.status),
  );
  return { entries: active, count: active.length };
}

export function listLocalEntries(statuses?: WaitlistStatus[]): WaitlistEntry[] {
  const entries = readEntries();
  if (!statuses) return entries;
  return entries.filter((e) => statuses.includes(e.status));
}

export function createLocalEntry(input: CreateWaitlistInput): WaitlistEntry {
  const entries = readEntries();
  const settings = readSettings();
  const entry: WaitlistEntry = {
    id: crypto.randomUUID(),
    ticket_number: nextTicketNumber(entries, settings.ticket_prefix),
    name: input.name.trim(),
    phone: input.phone.trim(),
    party_size: input.party_size,
    child_count: input.child_count ?? 0,
    notes: input.notes?.trim() ?? "",
    status: "waiting",
    source: input.source ?? "kiosk",
    table_id: null,
    created_at: new Date().toISOString(),
    notified_at: null,
    checked_in_at: null,
    seated_at: null,
  };
  writeEntries([...entries, entry]);
  return entry;
}

export function updateLocalStatus(
  id: string,
  status: WaitlistStatus,
): WaitlistEntry | null {
  const entries = readEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const entry = { ...entries[index] };

  entry.status = status;
  if (status === "notified") entry.notified_at = now;
  if (status === "checked_in") entry.checked_in_at = now;
  if (status === "seated") entry.seated_at = now;

  entries[index] = entry;
  writeEntries(entries);
  return entry;
}

export function getLocalActiveCount(): number {
  return readEntries().filter((e) =>
    ["waiting", "notified", "checked_in"].includes(e.status),
  ).length;
}
