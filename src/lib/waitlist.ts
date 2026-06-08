import { getDb } from "./db";
import type {
  CreateWaitlistInput,
  Settings,
  Table,
  WaitlistEntry,
  WaitlistStatus,
} from "./types";

function rowToEntry(row: Record<string, unknown>): WaitlistEntry {
  return {
    id: row.id as string,
    ticket_number: row.ticket_number as string,
    name: row.name as string,
    phone: row.phone as string,
    party_size: row.party_size as number,
    child_count: row.child_count as number,
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
    capacity: row.capacity as number,
    status: row.status as Table["status"],
    section: row.section as string,
    occupied_at: (row.occupied_at as string | null) ?? null,
    waitlist_entry_id: (row.waitlist_entry_id as string | null) ?? null,
  };
}

export function getSettings(): Settings {
  const db = getDb();
  const row = db
    .prepare("SELECT restaurant_name, ticket_prefix FROM settings WHERE id = 1")
    .get() as Settings;
  return row;
}

export function updateSettings(updates: Partial<Settings>): Settings {
  const db = getDb();
  const current = getSettings();

  db.prepare(
    `UPDATE settings SET
      restaurant_name = ?,
      ticket_prefix = ?
    WHERE id = 1`,
  ).run(
    updates.restaurant_name ?? current.restaurant_name,
    updates.ticket_prefix ?? current.ticket_prefix,
  );

  return getSettings();
}

function nextTicketNumber(): string {
  const db = getDb();
  const { ticket_prefix } = getSettings();
  const row = db
    .prepare(
      `SELECT ticket_number FROM waitlist_entries
       WHERE ticket_number LIKE ?
       ORDER BY ticket_number DESC LIMIT 1`,
    )
    .get(`${ticket_prefix}%`) as { ticket_number: string } | undefined;

  if (!row) return `${ticket_prefix}01`;

  const match = row.ticket_number.match(/(\d+)$/);
  const next = match ? parseInt(match[1], 10) + 1 : 1;
  return `${ticket_prefix}${String(next).padStart(2, "0")}`;
}

export function listWaitlistEntries(status?: WaitlistStatus | WaitlistStatus[]) {
  const db = getDb();
  let query = "SELECT * FROM waitlist_entries";
  const params: string[] = [];

  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    query += ` WHERE status IN (${statuses.map(() => "?").join(", ")})`;
    params.push(...statuses);
  }

  query += " ORDER BY created_at ASC";

  const rows = db.prepare(query).all(...params) as Record<string, unknown>[];
  return rows.map(rowToEntry);
}

export function getWaitlistEntry(id: string): WaitlistEntry | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM waitlist_entries WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToEntry(row) : null;
}

export function createWaitlistEntry(input: CreateWaitlistInput): WaitlistEntry {
  const db = getDb();
  const id = crypto.randomUUID();
  const ticket_number = nextTicketNumber();

  db.prepare(
    `INSERT INTO waitlist_entries (
      id, ticket_number, name, phone, party_size, child_count, notes, status, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'waiting', ?)`,
  ).run(
    id,
    ticket_number,
    input.name.trim(),
    input.phone.trim(),
    input.party_size,
    input.child_count ?? 0,
    input.notes?.trim() ?? "",
    input.source ?? "kiosk",
  );

  return getWaitlistEntry(id)!;
}

export function updateWaitlistStatus(
  id: string,
  status: WaitlistStatus,
  tableId?: string,
): WaitlistEntry | null {
  const db = getDb();
  const entry = getWaitlistEntry(id);
  if (!entry) return null;

  const now = new Date().toISOString();

  if (status === "notified") {
    db.prepare(
      "UPDATE waitlist_entries SET status = ?, notified_at = ? WHERE id = ?",
    ).run(status, now, id);
  } else if (status === "checked_in") {
    db.prepare(
      "UPDATE waitlist_entries SET status = ?, checked_in_at = ? WHERE id = ?",
    ).run(status, now, id);
  } else if (status === "seated") {
    db.prepare(
      `UPDATE waitlist_entries SET status = ?, seated_at = ?, table_id = ? WHERE id = ?`,
    ).run(status, now, tableId ?? null, id);

    if (tableId) {
      db.prepare(
        `UPDATE tables SET status = 'occupied', occupied_at = ?, waitlist_entry_id = ? WHERE id = ?`,
      ).run(now, id, tableId);
    }
  } else {
    db.prepare("UPDATE waitlist_entries SET status = ? WHERE id = ?").run(
      status,
      id,
    );
  }

  return getWaitlistEntry(id);
}

export function searchWaitlistEntries(query: string): WaitlistEntry[] {
  const db = getDb();
  const like = `%${query.trim()}%`;
  const rows = db
    .prepare(
      `SELECT * FROM waitlist_entries
       WHERE name LIKE ? OR phone LIKE ? OR ticket_number LIKE ?
       ORDER BY created_at DESC`,
    )
    .all(like, like, like) as Record<string, unknown>[];
  return rows.map(rowToEntry);
}

export function listTables(): Table[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM tables ORDER BY sort_order ASC")
    .all() as Record<string, unknown>[];
  return rows.map(rowToTable);
}

export function getTable(id: string): Table | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM tables WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToTable(row) : null;
}

export function releaseTable(id: string): Table | null {
  const db = getDb();
  const table = getTable(id);
  if (!table) return null;

  db.prepare(
    `UPDATE tables SET status = 'available', occupied_at = NULL, waitlist_entry_id = NULL WHERE id = ?`,
  ).run(id);

  return getTable(id);
}

export function getActiveWaitlistCount(): number {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(*) as count FROM waitlist_entries
       WHERE status IN ('waiting', 'notified', 'checked_in')`,
    )
    .get() as { count: number };
  return row.count;
}
