// Booking business rules shared by the DTOs and OrdersService.
// Values match what the frontend offers and what is already stored.

export const EVENT_TYPES = [
  'Marriage',
  'Reception',
  'Engagement',
  'Birthday',
  'Babyshower',
  'others',
] as const;

export const PACKAGE_LEVELS = [
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
] as const;

// "Rejected" is capitalised in existing data and in the frontend.
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'Rejected',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUSES = Object.values(ORDER_STATUS);

// Bookings that still hold a date; used for duplicate detection.
export const ACTIVE_STATUSES: OrderStatus[] = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
];

type Actor = 'admin' | 'owner';

// Allowed status changes and who may make them. Rejected and cancelled are final.
const TRANSITIONS: Record<
  OrderStatus,
  Partial<Record<OrderStatus, Actor[]>>
> = {
  [ORDER_STATUS.PENDING]: {
    [ORDER_STATUS.CONFIRMED]: ['admin'],
    [ORDER_STATUS.REJECTED]: ['admin'],
    [ORDER_STATUS.CANCELLED]: ['owner', 'admin'],
  },
  [ORDER_STATUS.CONFIRMED]: {
    [ORDER_STATUS.CANCELLED]: ['admin'],
  },
  [ORDER_STATUS.REJECTED]: {},
  [ORDER_STATUS.CANCELLED]: {},
};

/** Maps a stored status to its canonical value, tolerating case differences. */
export const normalizeStatus = (status: string): OrderStatus | undefined =>
  ORDER_STATUSES.find((s) => s.toLowerCase() === (status ?? '').toLowerCase());

export type TransitionCheck = 'ok' | 'invalid' | 'forbidden';

export const checkTransition = (
  from: string,
  to: OrderStatus,
  actor: { isAdmin: boolean; isOwner: boolean },
): TransitionCheck => {
  const current = normalizeStatus(from);
  const allowed = current ? TRANSITIONS[current][to] : undefined;
  if (!allowed) return 'invalid';
  const permitted =
    (actor.isAdmin && allowed.includes('admin')) ||
    (actor.isOwner && allowed.includes('owner'));
  return permitted ? 'ok' : 'forbidden';
};

/** Today's date (server local time) as YYYY-MM-DD, the format event_date uses. */
export const todayISO = (now = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const isPastDate = (date: string, now = new Date()) =>
  date < todayISO(now);

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-30). */
export const isCalendarDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
};
