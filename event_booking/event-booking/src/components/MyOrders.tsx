import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LuArrowRight, LuSearch } from 'react-icons/lu';
import { Order } from '../types/types';
import { apiErrorMessage, updateOrder } from '../service/_request';
import { useOrders } from '../hooks/useOrders';
import { statusKey } from '../lib/format';
import BookingCard, { BookingGridSkeleton } from './common/BookingCard';
import BookingFilters, { applyFilters, DEFAULT_FILTERS, Filters } from './common/BookingFilters';
import { EmptyState, ErrorState, Spinner } from './common/ui';

// Two-step cancel so a single mis-tap can't cancel a booking.
export const CancelAction = ({ order, onCancelled }: { order: Order; onCancelled: () => void }) => {
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);

    const handleCancel = async () => {
        setBusy(true);
        try {
            await updateOrder(order.order_id, { status: "cancelled" })
            toast("Booking cancelled")
            onCancelled()
        } catch (err) {
            console.error("Error cancelling order:", err);
            toast.error(apiErrorMessage(err, "Couldn't cancel this booking. Please try again."))
            setBusy(false);
            setConfirming(false);
        }
    }

    if (!confirming) {
        return <button type="button" className="btn btn--sm btn--danger" onClick={() => setConfirming(true)}>Cancel booking</button>;
    }
    return (
        <>
            <span className="booking-card__confirm">Cancel this booking?</span>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirming(false)} disabled={busy}>Keep</button>
            <button type="button" className="btn btn--sm btn--danger" onClick={handleCancel} disabled={busy} aria-busy={busy}>
                {busy ? <Spinner /> : null} Yes, cancel
            </button>
        </>
    );
}

const MyOrders = () => {

    const user_id = localStorage.getItem('flameToken');
    const [searchParams] = useSearchParams();
    const { orders: myorders, loading, error, reload: fetchOrders } = useOrders();
    const [filters, setFilters] = useState<Filters>(() => ({ ...DEFAULT_FILTERS, q: searchParams.get("q") ?? "" }));
    const [lastQuery, setLastQuery] = useState(searchParams.get("q"));

    // Header search navigates here with ?q=; pick up new queries while already on the page.
    if (searchParams.get("q") !== lastQuery) {
        setLastQuery(searchParams.get("q"));
        setFilters((f) => ({ ...f, q: searchParams.get("q") ?? "" }));
    }

    const userOrders = useMemo(() => {
        if (!user_id) return [];
        return myorders.filter((order: Order) => order.customer_id === user_id);
    }, [myorders, user_id]);

    const visible = useMemo(() => applyFilters(userOrders, filters), [userOrders, filters]);

    return (
        <div className="container page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Account</span>
                    <h1 className="page-header__title">My bookings</h1>
                    <p className="page-header__lead">Track the status of your requests. Pending bookings can be cancelled.</p>
                </div>
                <Link to="/order" className="btn btn--primary">Book an event <LuArrowRight /></Link>
            </div>

            {loading ? (
                <BookingGridSkeleton />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchOrders} />
            ) : userOrders.length === 0 ? (
                <EmptyState
                    title="No bookings yet"
                    action={<Link to="/order" className="btn btn--primary">Make your first booking</Link>}
                >
                    Once you send a booking request, you'll be able to follow its status here.
                </EmptyState>
            ) : (
                <>
                    <BookingFilters orders={userOrders} filters={filters} onChange={setFilters} />
                    <p className="toolbar__meta" aria-live="polite">
                        Showing {visible.length} of {userOrders.length} booking{userOrders.length === 1 ? "" : "s"}
                    </p>
                    {visible.length === 0 ? (
                        <EmptyState
                            icon={LuSearch}
                            title="No bookings match these filters"
                            action={<button type="button" className="btn" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>}
                        />
                    ) : (
                        <div className="booking-grid">
                            {visible.map((order) => (
                                <BookingCard
                                    key={order.order_id}
                                    order={order}
                                    actions={statusKey(order.status) === "pending"
                                        ? <CancelAction order={order} onCancelled={fetchOrders} />
                                        : undefined}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MyOrders;
