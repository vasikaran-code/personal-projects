import { LuSearch } from "react-icons/lu";
import { Order } from "../../types/types";
import { EVENT_TYPES } from "../../lib/catalog";
import { byEventDate, STATUS_LABELS, StatusKey, statusKey } from "../../lib/format";

export interface Filters {
  q: string;
  status: StatusKey | "all";
  type: string;
  sort: "date-asc" | "date-desc";
}

export const DEFAULT_FILTERS: Filters = { q: "", status: "all", type: "all", sort: "date-asc" };

// `searchText` lets a page include extra searchable text, e.g. the customer's name.
export const applyFilters = (orders: Order[], filters: Filters, searchText?: (o: Order) => string) => {
  const q = filters.q.trim().toLowerCase();
  const result = orders.filter((o) => {
    if (filters.status !== "all" && statusKey(o.status) !== filters.status) return false;
    if (filters.type !== "all" && o.event_type?.toLowerCase() !== filters.type.toLowerCase()) return false;
    if (!q) return true;
    const haystack = [o.name, o.venue, o.event_type, o.order_id, searchText?.(o)].join(" ").toLowerCase();
    return haystack.includes(q);
  });
  result.sort(byEventDate);
  if (filters.sort === "date-desc") result.reverse();
  return result;
};

interface BookingFiltersProps {
  orders: Order[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  statuses?: StatusKey[];
  searchPlaceholder?: string;
}

const BookingFilters = ({
  orders,
  filters,
  onChange,
  statuses = ["pending", "confirmed", "cancelled", "rejected"],
  searchPlaceholder = "Search by name, venue or reference",
}: BookingFiltersProps) => {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const count = (status: StatusKey | "all") =>
    status === "all" ? orders.length : orders.filter((o) => statusKey(o.status) === status).length;

  return (
    <>
      {statuses.length > 1 && (
        <div className="tabs" role="group" aria-label="Filter by status">
          {(["all", ...statuses] as const).map((status) => (
            <button
              key={status}
              type="button"
              className="tab"
              aria-pressed={filters.status === status}
              onClick={() => set({ status })}
            >
              {status === "all" ? "All" : STATUS_LABELS[status]}
              <span className="tab__count">{count(status)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="toolbar">
        <div className="field__control">
          <LuSearch className="field__icon" aria-hidden="true" />
          <label htmlFor="booking-search" className="visually-hidden">
            Search bookings
          </label>
          <input
            id="booking-search"
            type="search"
            className="input input--with-icon"
            placeholder={searchPlaceholder}
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="booking-type" className="visually-hidden">
            Occasion
          </label>
          <select
            id="booking-type"
            className="select"
            value={filters.type}
            onChange={(e) => set({ type: e.target.value })}
          >
            <option value="all">All occasions</option>
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="booking-sort" className="visually-hidden">
            Sort by
          </label>
          <select
            id="booking-sort"
            className="select"
            value={filters.sort}
            onChange={(e) => set({ sort: e.target.value as Filters["sort"] })}
          >
            <option value="date-asc">Event date: soonest</option>
            <option value="date-desc">Event date: latest</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default BookingFilters;
