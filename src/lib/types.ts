export type WaitlistStatus =
  | "waiting"
  | "notified"
  | "checked_in"
  | "seated"
  | "cancelled";

export type WaitlistSource = "kiosk" | "staff" | "call_in" | "online";

export type TableStatus = "available" | "occupied";

export type WaitlistProgressStatus =
  | "waiting"
  | "notified"
  | "checked_in"
  | "seated"
  | "cancelled";

export interface WaitlistProgress {
  restaurant_name: string;
  ticket_number: string;
  guest_name: string;
  party_size: number;
  status: WaitlistProgressStatus;
  position: number | null;
  parties_ahead: number;
  status_message: string;
  wait_time: string;
}

export interface WaitlistEntry {
  id: string;
  public_token: string;
  ticket_number: string;
  name: string;
  phone: string;
  sms_opt_in: boolean;
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

export type SmsMessageStatus = "sent" | "delivered" | "failed" | "received";
export type SmsMessageSender = "system" | "staff" | "guest";
export type SmsMessageDirection = "inbound" | "outbound";

export interface SmsMessage {
  id: string;
  waitlist_entry_id: string;
  direction: SmsMessageDirection;
  body: string;
  status: SmsMessageStatus;
  telnyx_message_id: string | null;
  sent_by: SmsMessageSender;
  created_at: string;
}

export interface CreateWaitlistInput {
  name: string;
  phone?: string;
  party_size: number;
  child_count?: number;
  notes?: string;
  source?: WaitlistSource;
  sms_opt_in?: boolean;
}
