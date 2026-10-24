import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowRight, LuCalendarDays, LuMapPin } from 'react-icons/lu';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useOrders } from '../hooks/useOrders';
import { EVENT_TYPES, PACKAGES, findEventType, findPackage } from '../lib/catalog';
import { byEventDate, firstName, formatDate, isUpcoming, statusKey } from '../lib/format';
import { Order } from '../types/types';
import BookingCard, { BookingGridSkeleton } from './common/BookingCard';
import { EmptyState, ErrorState, StatusBadge } from './common/ui';
import beachCouple from '../images/web/beach-couple.jpg';
import gardenCeremony from '../images/web/garden-ceremony.jpg';

const today = () => new Date().toISOString().split('T')[0];

const QuickBooking = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({ type: "", date: "", level: "", venue: "" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value && params.set(key, value));
    navigate(`/order${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form className="quick-booking" onSubmit={handleSubmit} aria-label="Start a booking">
      <div className="quick-booking__field">
        <label htmlFor="qb-type">Occasion</label>
        <select id="qb-type" name="type" className="select" value={query.type} onChange={update}>
          <option value="">Any occasion</option>
          {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className="quick-booking__field">
        <label htmlFor="qb-date">Date</label>
        <input id="qb-date" type="date" name="date" className="input" min={today()} value={query.date} onChange={update} />
      </div>
      <div className="quick-booking__field">
        <label htmlFor="qb-level">Package</label>
        <select id="qb-level" name="level" className="select" value={query.level} onChange={update}>
          <option value="">Any budget</option>
          {PACKAGES.map((p) => <option key={p.value} value={p.value}>{p.label} ({p.range})</option>)}
        </select>
      </div>
      <div className="quick-booking__field">
        <label htmlFor="qb-venue">Venue</label>
        <input id="qb-venue" type="text" name="venue" className="input" placeholder="Venue or area" value={query.venue} onChange={update} />
      </div>
      <button type="submit" className="btn btn--primary btn--lg quick-booking__submit">
        Start booking <LuArrowRight />
      </button>
    </form>
  );
};

const FeaturedBooking = ({ order }: { order: Order }) => {
  const type = findEventType(order.event_type);
  const pkg = findPackage(order.level);
  return (
    <Link to={`/booking/${order.order_id}`} className="feature-booking">
      <div className="feature-booking__meta">
        <span className="eyebrow eyebrow--light">Next up · {type.label}</span>
        <StatusBadge status={order.status} />
      </div>
      <h3>{order.name || type.label}</h3>
      <ul className="feature-booking__facts">
        <li><LuCalendarDays aria-hidden="true" /> {formatDate(order.event_date)}</li>
        <li><LuMapPin aria-hidden="true" /> {order.venue || "Venue not specified"}</li>
      </ul>
      <div className="feature-booking__foot">
        <span>{pkg ? `${pkg.label} package · ${pkg.range}` : order.level}</span>
        <span className="feature-booking__cta">View details <LuArrowRight /></span>
      </div>
    </Link>
  );
};

const CustomerHome = ({ name }: { name?: string }) => {
  const { id } = useCurrentUser();
  const { orders, loading, error, reload } = useOrders();

  const upcoming = useMemo(
    () =>
      orders
        .filter((o) => o.customer_id === id && isUpcoming(o.event_date))
        .filter((o) => ["pending", "confirmed"].includes(statusKey(o.status)))
        .sort(byEventDate),
    [orders, id]
  );
  const [next, ...rest] = upcoming;

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">{name ? `Welcome back, ${firstName(name)}` : "VK Weddings · Chennai"}</span>
            <h1>Celebrations, planned around your date.</h1>
            <p>
              Discover the perfect event venue for your special occasion. From elegant receptions to
              unforgettable weddings, we have the venue to make your dreams come true.
            </p>
            <div className="hero__actions">
              <Link to="/order" className="btn btn--dark btn--lg">Book an event</Link>
              <Link to="/myorder" className="btn btn--lg">My bookings</Link>
            </div>
          </div>
          <figure className="hero__media">
            <img src={beachCouple} alt="Bride and groom walking along the shore at sunset" />
          </figure>
        </div>
        <div className="container">
          <QuickBooking />
        </div>
      </section>

      <div className="container">
        <section className="section" aria-labelledby="occasions-title">
          <div className="section-head">
            <div>
              <h2 id="occasions-title">Browse by occasion</h2>
              <p>Pick a celebration to start a booking request with it pre-selected.</p>
            </div>
          </div>
          <ul className="occasion-grid">
            {EVENT_TYPES.map(({ value, label, icon: Icon }) => (
              <li key={value}>
                <Link to={`/order?type=${value}`} className="occasion">
                  <span className="occasion__icon" aria-hidden="true"><Icon /></span>
                  <span className="occasion__label">{label}</span>
                  <LuArrowRight className="occasion__arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" aria-labelledby="upcoming-title">
          <div className="section-head">
            <div>
              <h2 id="upcoming-title">Your upcoming events</h2>
              <p>Pending and confirmed bookings, soonest first.</p>
            </div>
            <Link to="/myorder" className="text-link">All bookings <LuArrowRight /></Link>
          </div>

          {loading ? (
            <BookingGridSkeleton count={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : !next ? (
            <EmptyState
              icon={LuCalendarDays}
              title="No upcoming events yet"
              action={<Link to="/order" className="btn btn--primary">Book an event</Link>}
            >
              When you send a booking request it will appear here while our team reviews it.
            </EmptyState>
          ) : (
            <div className={`upcoming ${rest.length ? "" : "upcoming--single"}`}>
              <FeaturedBooking order={next} />
              {rest.length > 0 && (
                <div className="upcoming__list">
                  {rest.slice(0, 2).map((o) => <BookingCard key={o.order_id} order={o} />)}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="section" aria-labelledby="packages-title">
          <div className="packages">
            <div className="packages__intro">
              <span className="eyebrow">Packages</span>
              <h2 id="packages-title">Choose a budget that fits the celebration</h2>
              <p>
                Every booking starts with a package tier. Your request is reviewed by our team before it is confirmed.
              </p>
            </div>
            <ol className="package-list">
              {PACKAGES.map((p, i) => (
                <li key={p.value}>
                  <Link to={`/order?level=${p.value}`} className="package-row">
                    <span className="package-row__index">0{i + 1}</span>
                    <span className="package-row__name">{p.label}</span>
                    <span className="package-row__range">{p.range}</span>
                    <LuArrowRight className="package-row__arrow" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section venue-band" aria-labelledby="venues-title">
          <figure className="venue-band__media">
            <img src={gardenCeremony} alt="Garden ceremony aisle lined with rose petals and candles" loading="lazy" />
          </figure>
          <div className="venue-band__copy">
            <span className="eyebrow">Venues</span>
            <h2 id="venues-title">Explore our curated venues</h2>
            <p>
              Exceptional event spaces that captivate and inspire. From grand ballrooms to intimate gatherings,
              our curated selection offers the perfect backdrop for your most cherished celebrations.
            </p>
            <Link to="/order" className="btn btn--dark">Plan your event <LuArrowRight /></Link>
          </div>
        </section>
      </div>
    </>
  );
};

const AdminHome = ({ name }: { name?: string }) => {
  const { orders, loading, error, reload } = useOrders();

  const pending = useMemo(() => orders.filter((o) => statusKey(o.status) === "pending").sort(byEventDate), [orders]);
  const upcomingConfirmed = useMemo(
    () => orders.filter((o) => statusKey(o.status) === "confirmed" && isUpcoming(o.event_date)).sort(byEventDate),
    [orders]
  );

  const stats = [
    { label: "Awaiting review", value: pending.length, to: "/neworder" },
    { label: "Confirmed & upcoming", value: upcomingConfirmed.length, to: "/orders" },
    { label: "Total bookings", value: orders.length, to: "/orders" },
  ];

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1 className="page-header__title">{name ? `Good to see you, ${firstName(name)}` : "Overview"}</h1>
          <p className="page-header__lead">Review new booking requests and keep track of confirmed events.</p>
        </div>
        <Link to="/neworder" className="btn btn--primary">Review requests <LuArrowRight /></Link>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <>
          <ul className="stat-row">
            {stats.map((s) => (
              <li key={s.label}>
                <Link to={s.to} className="stat">
                  <span className="stat__label">{s.label}</span>
                  <span className="stat__value">
                    {loading ? <span className="skeleton" style={{ display: "block", width: 48, height: 36 }} /> : s.value}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <section className="section" aria-labelledby="review-title">
            <div className="section-head">
              <div>
                <h2 id="review-title">Needs review</h2>
                <p>Pending requests, soonest event first.</p>
              </div>
              <Link to="/neworder" className="text-link">All requests <LuArrowRight /></Link>
            </div>
            {loading ? (
              <BookingGridSkeleton count={3} />
            ) : pending.length === 0 ? (
              <EmptyState title="You're all caught up">There are no booking requests waiting for review.</EmptyState>
            ) : (
              <div className="booking-grid">
                {pending.slice(0, 3).map((o) => <BookingCard key={o.order_id} order={o} />)}
              </div>
            )}
          </section>

          <section className="section" aria-labelledby="coming-title">
            <div className="section-head">
              <div>
                <h2 id="coming-title">Coming up</h2>
                <p>Confirmed events from today onward.</p>
              </div>
              <Link to="/orders" className="text-link">All bookings <LuArrowRight /></Link>
            </div>
            {loading ? (
              <BookingGridSkeleton count={3} />
            ) : upcomingConfirmed.length === 0 ? (
              <EmptyState icon={LuCalendarDays} title="No confirmed events ahead">
                Confirmed bookings with a future date will be listed here.
              </EmptyState>
            ) : (
              <div className="booking-grid">
                {upcomingConfirmed.slice(0, 3).map((o) => <BookingCard key={o.order_id} order={o} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

const Home = () => {
  const { user, isAdmin, loading } = useCurrentUser();

  if (loading) return <div className="container page"><BookingGridSkeleton count={3} /></div>;
  return isAdmin ? <AdminHome name={user?.cust_name} /> : <CustomerHome name={user?.cust_name} />;
}

export default Home
