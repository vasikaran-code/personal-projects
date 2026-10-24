import { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { LuArrowLeft, LuCalendarDays, LuMail, LuMapPin, LuPhone, LuSearch, LuUser, LuWallet } from 'react-icons/lu';
import { Order } from '../types/types';
import { getOrder } from '../service/_request';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { CEREMONY_TYPES, findEventType, findPackage } from '../lib/catalog';
import { formatDate, STATUS_LABELS, statusKey } from '../lib/format';
import { EmptyState, ErrorState, LoadingBlock, StatusBadge } from './common/ui';
import { CancelAction } from './MyOrders';
import { ReviewActions } from './NewOrders';
import gardenCeremony from '../images/web/garden-ceremony.jpg';

const Timeline = ({ status }: { status?: string }) => {
  const key = statusKey(status);
  const steps = [
    { label: "Request sent", state: "done" },
    { label: "Under review", state: key === "pending" ? "current" : "done" },
    { label: key === "pending" ? "Confirmed" : STATUS_LABELS[key], state: key === "pending" ? "todo" : key === "confirmed" ? "done" : "stopped" },
  ];
  return (
    <ol className="timeline" aria-label="Booking progress">
      {steps.map((step) => (
        <li key={step.label} className={`timeline__step is-${step.state}`} aria-current={step.state === "current" ? "step" : undefined}>
          <span className="timeline__dot" aria-hidden="true" />
          {step.label}
        </li>
      ))}
    </ol>
  );
};

const EventDetails = () => {

  const { id = "" } = useParams();
  const { id: userId, isAdmin, loading: userLoading } = useCurrentUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerFailed, setBannerFailed] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getOrder(id);
      setOrder(res || null);
    } catch (err) {
      // The API answers 404 for unknown bookings and 403 for other customers' ones.
      if (axios.isAxiosError(err) && (err.response?.status === 404 || err.response?.status === 403)) {
        setOrder(null);
        return;
      }
      console.error("Error fetching order:", err);
      setError("We couldn't load this booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const backTo = isAdmin ? (statusKey(order?.status) === "pending" ? "/neworder" : "/orders") : "/myorder";
  const backLabel = isAdmin ? (statusKey(order?.status) === "pending" ? "Booking requests" : "All bookings") : "My bookings";

  if (loading || userLoading) return <div className="container page"><LoadingBlock label="Loading booking" /></div>;
  if (error) return <div className="container page"><ErrorState message={error} onRetry={load} /></div>;

  // Customers can only see their own bookings; admins can see all.
  if (!order || (!isAdmin && order.customer_id !== userId)) {
    return (
      <div className="container page">
        <EmptyState
          icon={LuSearch}
          title="Booking not found"
          action={<Link to={backTo} className="btn">Back to {backLabel.toLowerCase()}</Link>}
        >
          This booking doesn't exist or isn't linked to your account.
        </EmptyState>
      </div>
    );
  }

  const { name, order_id, event_type, contact, alternative_contact, mail_id, level, event_date, status, venue } = order;
  const type = findEventType(event_type);
  const pkg = findPackage(level);
  const key = statusKey(status);
  const showPhoto = CEREMONY_TYPES.includes(type.value) && !bannerFailed;
  const TypeIcon = type.icon;

  return (
    <>
      <section className={`detail-hero ${showPhoto ? "detail-hero--photo" : ""}`}>
        {showPhoto && (
          <img className="detail-hero__img" src={gardenCeremony} alt="" onError={() => setBannerFailed(true)} />
        )}
        <div className="container detail-hero__inner">
          <Link to={backTo} className="detail-hero__back"><LuArrowLeft aria-hidden="true" /> {backLabel}</Link>
          <div className="detail-hero__meta">
            <span className="detail-hero__type"><TypeIcon aria-hidden="true" /> {type.label}</span>
            <StatusBadge status={status} />
          </div>
          <h1>{name || type.label}</h1>
          <ul className="detail-hero__facts">
            <li><LuCalendarDays aria-hidden="true" /> {formatDate(event_date)}</li>
            <li><LuMapPin aria-hidden="true" /> {venue || "Venue not specified"}</li>
          </ul>
        </div>
      </section>

      <div className="container detail-layout">
        <div className="detail-main">
          <section className="detail-section" aria-labelledby="progress-title">
            <h2 id="progress-title">Booking status</h2>
            <Timeline status={status} />
            <p className="detail-section__note">
              {key === "pending" && "This request is waiting for review. You'll see the status change here once it's decided."}
              {key === "confirmed" && "This booking has been confirmed by the VK Weddings team."}
              {key === "rejected" && "This request was not accepted. You're welcome to send a new request for another date or venue."}
              {key === "cancelled" && "This booking was cancelled."}
            </p>
          </section>

          <section className="detail-section" aria-labelledby="event-title">
            <h2 id="event-title">Event information</h2>
            <dl className="detail-list">
              <div><dt>Occasion</dt><dd>{type.label}</dd></div>
              <div><dt>Date</dt><dd>{formatDate(event_date)}</dd></div>
              <div><dt>Venue</dt><dd>{venue || "—"}</dd></div>
              <div><dt>Package</dt><dd>{pkg ? `${pkg.label} (${pkg.range})` : level || "—"}</dd></div>
              <div><dt>Reference</dt><dd className="mono">{order_id}</dd></div>
            </dl>
          </section>

          <section className="detail-section" aria-labelledby="contact-title">
            <h2 id="contact-title">Contact</h2>
            <ul className="contact-list">
              <li><LuUser aria-hidden="true" /> <span>{name || "—"}</span></li>
              {contact && <li><LuPhone aria-hidden="true" /> <a href={`tel:${contact}`}>{contact}</a></li>}
              {alternative_contact && (
                <li><LuPhone aria-hidden="true" /> <a href={`tel:${alternative_contact}`}>{alternative_contact}</a> <span className="muted">(alternative)</span></li>
              )}
              {mail_id && <li><LuMail aria-hidden="true" /> <a href={`mailto:${mail_id}`}>{mail_id}</a></li>}
            </ul>
          </section>
        </div>

        <aside className="detail-aside" aria-label="Booking summary">
          <div className="summary__card">
            <div className="summary__price">
              <span><LuWallet aria-hidden="true" /> {pkg ? `${pkg.label} package` : "Package"}</span>
              <strong>{pkg ? pkg.range : level || "—"}</strong>
            </div>
            <dl className="summary__list">
              <div><dt>Status</dt><dd><StatusBadge status={status} /></dd></div>
              <div><dt>Date</dt><dd>{formatDate(event_date, "short")}</dd></div>
            </dl>

            {key === "pending" && isAdmin && (
              <div className="summary__actions">
                <ReviewActions order={order} onDone={load} />
              </div>
            )}
            {key === "pending" && !isAdmin && (
              <div className="summary__actions">
                <CancelAction order={order} onCancelled={load} />
              </div>
            )}
            {!isAdmin && key !== "pending" && (
              <Link to={`/order?type=${encodeURIComponent(type.value)}`} className="btn btn--dark btn--block">
                Book another {type.label.toLowerCase()}
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

export default EventDetails
