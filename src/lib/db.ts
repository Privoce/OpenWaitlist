import { createClient, type Client } from "@libsql/client";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { SCHEMA_SQL, SEED_TABLES } from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "openwaitlist.db");

let turso: Client | null = null;
let sqlite: Database.Database | null = null;
let initialized = false;

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

export async function initDb() {
  if (initialized) return;
  if (useTurso()) {
    await initTurso();
  } else {
    initSqlite();
  }
  initialized = true;
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
