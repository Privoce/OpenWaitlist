import { getSampleWaitlistProgress, isSampleWaitlistToken } from "./demo-progress";
import { BRAND_NAME } from "./brand";
import { execute, queryAll, queryOne } from "./db";
import { formatWaitTime } from "./format";
import { generatePublicToken } from "./public-url";
import type {
  CreateWaitlistInput,
  Settings,
  Table,
  WaitlistEntry,
  WaitlistProgress,
  WaitlistStatus,
} from "./types";

function rowToEntry(row: Record<string, unknown>): WaitlistEntry {
  return {
    id: row.id as string,
    public_token: row.public_token as string,
    ticket_number: row.ticket_number as string,
    name: row.name as string,
    phone: row.phone as string,
    sms_opt_in: Boolean(row.sms_opt_in),
    party_size: Number(row.party_size),
    child_count: Number(row.child_count),
    notes: row.notes as string,
    status: row.status as WaitlistEntry["status"],
    source: row.source as WaitlistEntry["source"],
    table_id: (row.table_id as string | null) ?? null,
    created_at: row.created_at as string,
    notified_at: (row.notified_at as string | null) ?? null,
    checked_in_at: (row.checked_in_at as string | null) ?? null,
    seated_at: (row.seated_at as string | null) ?? null,
  };
}

function rowToTable(row: Record<string, unknown>): Table {
  return {
    id: row.id as string,
    label: row.label as string,
    shape: row.shape as Table["shape"],
    capacity: Number(row.capacity),
    status: row.status as Table["status"],
    section: row.section as string,
    occupied_at: (row.occupied_at as string | null) ?? null,
    waitlist_entry_id: (row.waitlist_entry_id as string | null) ?? null,
  };
}

export async function getSettings(): Promise<Settings> {
  const row = await queryOne(
    "SELECT restaurant_name, ticket_prefix FROM settings WHERE id = 1",
  );
  return {
    restaurant_name: BRAND_NAME,
    ticket_prefix: String(row?.ticket_prefix ?? "SE"),
  };
}

export async function updateSettings(updates: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();

  await execute(
    `UPDATE settings SET restaurant_name = ?, ticket_prefix = ? WHERE id = 1`,
    [
      BRAND_NAME,
      updates.ticket_prefix ?? current.ticket_prefix,
    ],
  );

  return getSettings();
}

async function nextTicketNumber(): Promise<string> {
  const { ticket_prefix } = await getSettings();
  const row = await queryOne(
    `SELECT ticket_number FROM waitlist_entries
     WHERE ticket_number LIKE ?
     ORDER BY ticket_number DESC LIMIT 1`,
    [`${ticket_prefix}%`],
  );

  if (!row) return `${ticket_prefix}01`;

  const match = String(row.ticket_number).match(/(\d+)$/);
  const next = match ? parseInt(match[1], 10) + 1 : 1;
  return `${ticket_prefix}${String(next).padStart(2, "0")}`;
}

export async function listWaitlistEntries(
  status?: WaitlistStatus | WaitlistStatus[],
): Promise<WaitlistEntry[]> {
  let query = "SELECT * FROM waitlist_entries";
  const params: string[] = [];

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    query += ` WHERE status IN (${statuses.map(() => "?").join(", ")})`;
    params.push(...statuses);
  }

  query += " ORDER BY created_at ASC";

  const rows = await queryAll(query, params);
  return rows.map(rowToEntry);
}

export async function getWaitlistEntry(id: string): Promise<WaitlistEntry | null> {
  const row = await queryOne("SELECT * FROM waitlist_entries WHERE id = ?", [id]);
  return row ? rowToEntry(row) : null;
}

export async function getWaitlistEntryByToken(
  token: string,
): Promise<WaitlistEntry | null> {
  const row = await queryOne(
    "SELECT * FROM waitlist_entries WHERE public_token = ?",
    [token],
  );
  return row ? rowToEntry(row) : null;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Guest";
}

function progressMessage(status: WaitlistStatus) {
  switch (status) {
    case "waiting":
      return "You're on the waitlist";
    case "notified":
      return "Your table is ready!";
    case "checked_in":
      return "You're checked in";
    case "seated":
      return "You've been seated";
    case "cancelled":
      return "Removed from the waitlist";
    default:
      return "Waitlist update";
  }
}

export async function getWaitlistProgress(
  token: string,
): Promise<WaitlistProgress | null> {
  if (isSampleWaitlistToken(token)) {
    return getSampleWaitlistProgress();
  }

  const entry = await getWaitlistEntryByToken(token);
  if (!entry) return null;

  const active = await listWaitlistEntries(["waiting", "notified", "checked_in"]);
  const index = active.findIndex((item) => item.id === entry.id);
  const isActive = index >= 0;

  return {
    restaurant_name: BRAND_NAME,
    ticket_number: entry.ticket_number,
    guest_name: firstName(entry.name),
    party_size: entry.party_size,
    status: entry.status,
    position: isActive ? index + 1 : null,
    parties_ahead: isActive ? index : 0,
    status_message: progressMessage(entry.status),
    wait_time: formatWaitTime(entry.created_at),
  };
}

export async function createWaitlistEntry(
  input: CreateWaitlistInput,
): Promise<WaitlistEntry> {
  const id = crypto.randomUUID();
  const ticket_number = await nextTicketNumber();
  const public_token = generatePublicToken();

  const smsOptIn = Boolean(input.sms_opt_in);
  const phone = smsOptIn ? (input.phone?.trim() ?? "") : "";

  await execute(
    `INSERT INTO waitlist_entries (
      id, public_token, ticket_number, name, phone, sms_opt_in, party_size, child_count, notes, status, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?)`,
    [
      id,
      public_token,
      ticket_number,
      input.name.trim(),
      phone,
      smsOptIn ? 1 : 0,
      input.party_size,
      input.child_count ?? 0,
      input.notes?.trim() ?? "",
      input.source ?? "kiosk",
    ],
  );

  return (await getWaitlistEntry(id))!;
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistStatus,
  tableId?: string,
): Promise<WaitlistEntry | null> {
  const entry = await getWaitlistEntry(id);
  if (!entry) return null;

  const now = new Date().toISOString();

  if (status === "notified") {
    await execute(
      "UPDATE waitlist_entries SET status = ?, notified_at = ? WHERE id = ?",
      [status, now, id],
    );
  } else if (status === "checked_in") {
    await execute(
      "UPDATE waitlist_entries SET status = ?, checked_in_at = ? WHERE id = ?",
      [status, now, id],
    );
  } else if (status === "seated") {
    await execute(
      `UPDATE waitlist_entries SET status = ?, seated_at = ?, table_id = ? WHERE id = ?`,
      [status, now, tableId ?? null, id],
    );

    if (tableId) {
      await execute(
        `UPDATE tables SET status = 'occupied', occupied_at = ?, waitlist_entry_id = ? WHERE id = ?`,
        [now, id, tableId],
      );
    }
  } else {
    await execute("UPDATE waitlist_entries SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }

  return getWaitlistEntry(id);
}

export async function searchWaitlistEntries(
  query: string,
): Promise<WaitlistEntry[]> {
  const like = `%${query.trim()}%`;
  const rows = await queryAll(
    `SELECT * FROM waitlist_entries
     WHERE name LIKE ? OR phone LIKE ? OR ticket_number LIKE ?
     ORDER BY created_at DESC`,
    [like, like, like],
  );
  return rows.map(rowToEntry);
}

export async function listTables(): Promise<Table[]> {
  const rows = await queryAll("SELECT * FROM tables ORDER BY sort_order ASC");
  return rows.map(rowToTable);
}

export async function getTable(id: string): Promise<Table | null> {
  const row = await queryOne("SELECT * FROM tables WHERE id = ?", [id]);
  return row ? rowToTable(row) : null;
}

export async function releaseTable(id: string): Promise<Table | null> {
  const table = await getTable(id);
  if (!table) return null;

  await execute(
    `UPDATE tables SET status = 'available', occupied_at = NULL, waitlist_entry_id = NULL WHERE id = ?`,
    [id],
  );

  return getTable(id);
}

export async function getActiveWaitlistCount(): Promise<number> {
  const row = await queryOne(
    `SELECT COUNT(*) as count FROM waitlist_entries
     WHERE status IN ('waiting', 'notified', 'checked_in')`,
  );
  return Number(row?.count ?? 0);
}
