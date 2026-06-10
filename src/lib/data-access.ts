import {
  createLocalEntry,
  getLocalActiveCount,
  getLocalSettings,
  getLocalWaitlist,
  getLocalWaitlistProgress,
  listLocalEntries,
  updateLocalStatus,
} from "./local-storage-db";
import type {
  CreateWaitlistInput,
  Settings,
  WaitlistEntry,
  WaitlistProgress,
  WaitlistStatus,
} from "./types";

export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}

export async function fetchSettings(): Promise<Settings> {
  if (isStaticExport) return getLocalSettings();
  const res = await fetch(apiUrl("/api/settings"));
  return res.json();
}

export async function fetchActiveWaitlist(): Promise<{
  entries: WaitlistEntry[];
  count: number;
}> {
  if (isStaticExport) return getLocalWaitlist();
  const res = await fetch(apiUrl("/api/waitlist"));
  return res.json();
}

export async function fetchAllEntries(
  statuses: WaitlistStatus[],
): Promise<WaitlistEntry[]> {
  if (isStaticExport) return listLocalEntries(statuses);
  const res = await fetch(
    apiUrl(`/api/waitlist?status=${statuses.join(",")}`),
  );
  return res.json();
}

export async function createWaitlistEntry(
  input: CreateWaitlistInput,
): Promise<{ ok: boolean; entry?: WaitlistEntry; error?: string }> {
  if (isStaticExport) {
    const entry = createLocalEntry(input);
    return { ok: true, entry };
  }

  const res = await fetch(apiUrl("/api/waitlist"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Request failed" };
  return { ok: true, entry: data as WaitlistEntry };
}

export async function patchWaitlistStatus(
  id: string,
  status: WaitlistStatus,
): Promise<WaitlistEntry | null> {
  if (isStaticExport) return updateLocalStatus(id, status);

  const res = await fetch(apiUrl(`/api/waitlist/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchWaitlistCount(): Promise<number> {
  if (isStaticExport) return getLocalActiveCount();
  const res = await fetch(apiUrl("/api/waitlist"));
  const data = await res.json();
  return data.count ?? 0;
}

export async function fetchWaitlistProgress(
  token: string,
): Promise<WaitlistProgress | null> {
  if (isStaticExport) return getLocalWaitlistProgress(token);

  const res = await fetch(apiUrl(`/api/waitlist/status/${token}`));
  if (!res.ok) return null;
  return res.json();
}
