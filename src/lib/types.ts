export type WaitlistStatus =
  | "waiting"
  | "notified"
  | "checked_in"
  | "seated"
  | "cancelled";

export type WaitlistSource = "kiosk" | "staff" | "call_in" | "online";

export type TableStatus = "available" | "occupied";

export interface WaitlistEntry {
  id: string;
  ticket_number: string;
  name: string;
  phone: string;
  party_size: number;
  child_count: number;
  notes: string;
  status: WaitlistStatus;
  source: WaitlistSource;
  table_id: string | null;
  created_at: string;
  notified_at: string | null;
  checked_in_at: string | null;
  seated_at: string | null;
}

export interface Table {
  id: string;
  label: string;
  shape: "square" | "circle";
  capacity: number;
  status: TableStatus;
  section: string;
  occupied_at: string | null;
  waitlist_entry_id: string | null;
}

export interface Settings {
  restaurant_name: string;
  ticket_prefix: string;
}

export interface CreateWaitlistInput {
  name: string;
  phone: string;
  party_size: number;
  child_count?: number;
  notes?: string;
  source?: WaitlistSource;
}
