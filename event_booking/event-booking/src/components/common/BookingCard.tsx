import React from "react";
import { Link } from "react-router-dom";
import { LuMapPin, LuUser, LuWallet } from "react-icons/lu";
import { Order } from "../../types/types";
import { findEventType, findPackage } from "../../lib/catalog";
import { dateParts } from "../../lib/format";
import { StatusBadge } from "./ui";

interface BookingCardProps {
  order: Order;
  customerName?: string;
  actions?: React.ReactNode;
}

const BookingCard = ({ order, customerName, actions }: BookingCardProps) => {
  const type = findEventType(order.event_type);
  const pkg = findPackage(order.level);
  const date = dateParts(order.event_date);
  const TypeIcon = type.icon;

  return (
    <article className="booking-card">
      <div className="booking-card__date" aria-label={`Event date ${order.event_date}`}>
        {date ? (
          <>
            <span className="booking-card__month">{date.month}</span>
            <span className="booking-card__day">{date.day}</span>
            <span className="booking-card__year">{date.year}</span>
          </>
        ) : (
          <span className="booking-card__year">No date</span>
        )}
      </div>

      <div className="booking-card__body">
        <div className="booking-card__top">
          <span className="booking-card__type">
            <TypeIcon aria-hidden="true" /> {type.label}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <h3 className="booking-card__title">
          <Link className="booking-card__link" to={`/booking/${order.order_id}`}>
            {order.name || type.label}
          </Link>
        </h3>
        <ul className="booking-card__facts">
          <li>
            <LuMapPin aria-hidden="true" />
            <span>{order.venue || "Venue not specified"}</span>
          </li>
          <li>
            <LuWallet aria-hidden="true" />
            <span>{pkg ? `${pkg.label} · ${pkg.range}` : order.level || "Package not set"}</span>
          </li>
          {customerName && (
            <li>
              <LuUser aria-hidden="true" />
              <span>Booked by {customerName}</span>
            </li>
          )}
        </ul>
      </div>

      {actions && <div className="booking-card__actions">{actions}</div>}
    </article>
  );
};

export const BookingCardSkeleton = () => (
  <div className="booking-card booking-card--skeleton" aria-hidden="true">
    <div className="booking-card__date">
      <span className="skeleton" style={{ width: 32, height: 12 }} />
      <span className="skeleton" style={{ width: 40, height: 32, marginTop: 6 }} />
    </div>
    <div className="booking-card__body">
      <span className="skeleton" style={{ width: "40%" }} />
      <span className="skeleton" style={{ width: "75%", height: 22 }} />
      <span className="skeleton" style={{ width: "60%" }} />
      <span className="skeleton" style={{ width: "50%" }} />
    </div>
  </div>
);

export const BookingGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="booking-grid" role="status" aria-label="Loading bookings">
    {Array.from({ length: count }, (_, i) => (
      <BookingCardSkeleton key={i} />
    ))}
  </div>
);

export default BookingCard;
