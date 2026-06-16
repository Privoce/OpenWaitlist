export function formatWaitTime(createdAt: string): string {
  const created = new Date(createdAt.endsWith("Z") ? createdAt : `${createdAt}Z`);
  const diffMs = Date.now() - created.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));

  if (mins < 1) return "< 1 min";
  if (mins === 1) return "1 min";
  return `${mins} mins`;
}

export function formatOccupiedTime(occupiedAt: string | null): string {
  if (!occupiedAt) return "00:00";
  const start = new Date(occupiedAt.endsWith("Z") ? occupiedAt : `${occupiedAt}Z`);
  const diffMs = Date.now() - start.getTime();
  const totalSecs = Math.floor(diffMs / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** US phone digits for matching (10-digit form). */
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits.slice(-10);
}
