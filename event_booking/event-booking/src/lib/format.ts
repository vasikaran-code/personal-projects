import { Order } from "../types/types";

export type StatusKey = "pending" | "confirmed" | "rejected" | "cancelled";

export const STATUS_LABELS: Record<StatusKey, string> = {
  pending: "Pending review",
  confirmed: "Confirmed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

// The API stores "pending", "confirmed", "cancelled" and "Rejected" — compare case-insensitively.
export const statusKey = (status?: string): StatusKey => {
  const key = (status ?? "pending").toLowerCase();
  return key in STATUS_LABELS ? (key as StatusKey) : "pending";
};

// event_date is stored as "YYYY-MM-DD"; parse it as a local date so it doesn't shift a day.
export const parseEventDate = (value?: string): Date | null => {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  const date = match ? new Date(+match[1], +match[2] - 1, +match[3]) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value?: string, style: "long" | "short" = "long"): string => {
  const date = parseEventDate(value);
  if (!date) return value || "Date not set";
  return date.toLocaleDateString("en-IN", {
    weekday: style === "long" ? "long" : "short",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
};

export const dateParts = (value?: string) => {
  const date = parseEventDate(value);
  if (!date) return null;
  return {
    day: date.getDate(),
    month: date.toLocaleDateString("en-IN", { month: "short" }),
    year: date.getFullYear(),
  };
};

export const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const isUpcoming = (value?: string) => {
  const date = parseEventDate(value);
  return !!date && date >= startOfToday();
};

export const byEventDate = (a: Order, b: Order) =>
  (parseEventDate(a.event_date)?.getTime() ?? 0) - (parseEventDate(b.event_date)?.getTime() ?? 0);

export const initials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

export const firstName = (name?: string) => {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return first ? first[0].toUpperCase() + first.slice(1) : "";
};
