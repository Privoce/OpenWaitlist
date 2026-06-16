import { createClient, type Client } from "@libsql/client";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { generatePublicToken } from "./public-url";
import { SCHEMA_SQL, SEED_TABLES } from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "openwaitlist.db");

let turso: Client | null = null;
let sqlite: Database.Database | null = null;
let dbReady = false;

export function useTurso() {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

function ensureSqliteDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function initTurso() {
  if (turso) return turso;

  turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const statements = SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const sql of statements) {
    await turso.execute(sql);
  }

  await seedTablesTurso(turso);
  return turso;
}

async function seedTablesTurso(client: Client) {
  const result = await client.execute("SELECT COUNT(*) AS count FROM tables");
  const count = Number(result.rows[0]?.count ?? 0);
  if (count > 0) return;

  for (const table of SEED_TABLES) {
    await client.execute({
      sql: `INSERT INTO tables (id, label, shape, capacity, status, section, sort_order)
            VALUES (?, ?, ?, ?, 'available', ?, ?)`,
      args: [
        crypto.randomUUID(),
        table.label,
        table.shape,
        table.capacity,
        table.section,
        table.x,
      ],
    });
  }
}

function initSqlite() {
  if (sqlite) return sqlite;

  ensureSqliteDir();
  sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(SCHEMA_SQL);
  seedTablesSqlite(sqlite);
  return sqlite;
}

function seedTablesSqlite(database: Database.Database) {
  const count = database
    .prepare("SELECT COUNT(*) as count FROM tables")
    .get() as { count: number };

  if (count.count > 0) return;

  const insert = database.prepare(`
    INSERT INTO tables (id, label, shape, capacity, status, section, sort_order)
    VALUES (?, ?, ?, ?, 'available', ?, ?)
  `);

  for (const table of SEED_TABLES) {
    insert.run(
      crypto.randomUUID(),
      table.label,
      table.shape,
      table.capacity,
      table.section,
      table.x,
    );
  }
}

async function migratePublicTokens() {
  const columns = await queryAll("PRAGMA table_info(waitlist_entries)");
  const hasToken = columns.some((column) => column.name === "public_token");

  if (!hasToken) {
    await execute("ALTER TABLE waitlist_entries ADD COLUMN public_token TEXT");
    await execute(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_public_token ON waitlist_entries(public_token)",
    );
  }

  const missing = await queryAll(
    "SELECT id FROM waitlist_entries WHERE public_token IS NULL OR public_token = ''",
  );

  for (const row of missing) {
    let token = generatePublicToken();
    let exists = await queryOne(
      "SELECT id FROM waitlist_entries WHERE public_token = ?",
      [token],
    );

    while (exists) {
      token = generatePublicToken();
      exists = await queryOne(
        "SELECT id FROM waitlist_entries WHERE public_token = ?",
        [token],
      );
    }

    await execute("UPDATE waitlist_entries SET public_token = ? WHERE id = ?", [
      token,
      row.id,
    ]);
  }
}

export async function initDb() {
  if (dbReady) return;
  if (useTurso()) {
    await initTurso();
  } else {
    initSqlite();
  }
  dbReady = true;
  await migratePublicTokens();
  await migrateSmsOptIn();
  await migrateSmsMessages();
}

async function migrateSmsMessages() {
  const tables = await queryAll(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'sms_messages'",
  );
  if (tables.length === 0) {
    await execute(`
      CREATE TABLE IF NOT EXISTS sms_messages (
        id TEXT PRIMARY KEY,
        waitlist_entry_id TEXT NOT NULL,
        direction TEXT NOT NULL DEFAULT 'outbound',
        body TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'sent',
        telnyx_message_id TEXT,
        sent_by TEXT NOT NULL DEFAULT 'system',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await execute(
      "CREATE INDEX IF NOT EXISTS idx_sms_messages_entry ON sms_messages(waitlist_entry_id, created_at)",
    );
  }
}

async function migrateSmsOptIn() {
  const columns = await queryAll("PRAGMA table_info(waitlist_entries)");
  const hasSmsOptIn = columns.some((column) => column.name === "sms_opt_in");

  if (!hasSmsOptIn) {
    await execute(
      "ALTER TABLE waitlist_entries ADD COLUMN sms_opt_in INTEGER NOT NULL DEFAULT 0",
    );
  }
}

function tursoRowToRecord(row: Record<string, unknown>): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    record[key] = value;
  }
  return record;
}

export async function queryAll(
  sql: string,
  args: unknown[] = [],
): Promise<Record<string, unknown>[]> {
  await initDb();

  if (useTurso()) {
    const result = await turso!.execute({ sql, args: args as never[] });
    return result.rows.map((row) => tursoRowToRecord(row as Record<string, unknown>));
  }

  const rows = sqlite!.prepare(sql).all(...args) as Record<string, unknown>[];
  return rows;
}

export async function queryOne(
  sql: string,
  args: unknown[] = [],
): Promise<Record<string, unknown> | null> {
  await initDb();

  if (useTurso()) {
    const result = await turso!.execute({ sql, args: args as never[] });
    if (result.rows.length === 0) return null;
    return tursoRowToRecord(result.rows[0] as Record<string, unknown>);
  }

  const row = sqlite!.prepare(sql).get(...args) as Record<string, unknown> | undefined;
  return row ?? null;
}

export async function execute(sql: string, args: unknown[] = []) {
  await initDb();

  if (useTurso()) {
    await turso!.execute({ sql, args: args as never[] });
    return;
  }

  sqlite!.prepare(sql).run(...args);
}
