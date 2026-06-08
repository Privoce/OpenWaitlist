import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "openwaitlist.db");

let db: Database.Database | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function seedTables(database: Database.Database) {
  const count = database
    .prepare("SELECT COUNT(*) as count FROM tables")
    .get() as { count: number };

  if (count.count > 0) return;

  const tables = [
    { label: "A1", shape: "square", capacity: 2, section: "dining room", x: 0 },
    { label: "A2", shape: "square", capacity: 2, section: "dining room", x: 1 },
    { label: "A3", shape: "square", capacity: 4, section: "dining room", x: 2 },
    { label: "A4", shape: "square", capacity: 4, section: "dining room", x: 3 },
    { label: "B1", shape: "circle", capacity: 4, section: "dining room", x: 4 },
    { label: "B2", shape: "circle", capacity: 6, section: "dining room", x: 5 },
    { label: "C1", shape: "square", capacity: 2, section: "dining room", x: 6 },
    { label: "C2", shape: "square", capacity: 2, section: "dining room", x: 7 },
    { label: "C3", shape: "square", capacity: 4, section: "dining room", x: 8 },
    { label: "C4", shape: "square", capacity: 4, section: "dining room", x: 9 },
    { label: "D1", shape: "circle", capacity: 6, section: "dining room", x: 10 },
    { label: "D2", shape: "circle", capacity: 8, section: "dining room", x: 11 },
    { label: "V1", shape: "square", capacity: 2, section: "dining room", x: 12 },
    { label: "V2", shape: "square", capacity: 2, section: "dining room", x: 13 },
    { label: "V3", shape: "square", capacity: 4, section: "dining room", x: 14 },
  ];

  const insert = database.prepare(`
    INSERT INTO tables (id, label, shape, capacity, status, section, sort_order)
    VALUES (?, ?, ?, ?, 'available', ?, ?)
  `);

  for (const table of tables) {
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

export function getDb(): Database.Database {
  if (db) return db;

  ensureDataDir();
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      restaurant_name TEXT NOT NULL DEFAULT 'My Restaurant',
      ticket_prefix TEXT NOT NULL DEFAULT 'SE'
    );

    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id TEXT PRIMARY KEY,
      ticket_number TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      child_count INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'waiting',
      source TEXT NOT NULL DEFAULT 'kiosk',
      table_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      notified_at TEXT,
      checked_in_at TEXT,
      seated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL UNIQUE,
      shape TEXT NOT NULL DEFAULT 'square',
      capacity INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      section TEXT NOT NULL DEFAULT 'dining room',
      sort_order INTEGER NOT NULL DEFAULT 0,
      occupied_at TEXT,
      waitlist_entry_id TEXT
    );

    INSERT OR IGNORE INTO settings (id, restaurant_name, ticket_prefix)
    VALUES (1, 'My Restaurant', 'SE');
  `);

  seedTables(db);

  return db;
}
