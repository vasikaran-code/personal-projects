import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { LuCheck, LuSearch, LuX } from 'react-icons/lu';
import { Order } from '../types/types';
import { updateOrder } from '../service/_request';
import { useCustomerMap, useOrders } from '../hooks/useOrders';
import { statusKey } from '../lib/format';
import BookingCard, { BookingGridSkeleton } from './common/BookingCard';
import BookingFilters, { applyFilters, DEFAULT_FILTERS, Filters } from './common/BookingFilters';
import { EmptyState, ErrorState, Spinner } from './common/ui';

// Status values the API already uses for review decisions.
export type ReviewStatus = "confirmed" | "Rejected";

export const ReviewActions = ({ order, onDone }: { order: Order; onDone: () => void }) => {
    const [busy, setBusy] = useState<ReviewStatus | null>(null);

    const handleStatus = async (status: ReviewStatus) => {
        setBusy(status);
        try {
            await updateOrder(order.order_id, { status })
            toast(status === "confirmed" ? "Booking confirmed" : "Booking rejected")
            onDone()
        } catch (err) {
            console.error("Error updating order:", err);
            toast.error("Couldn't update this booking. Please try again.")
            setBusy(null);
        }
    }

    return (
        <>
            <button type="button" className="btn btn--sm btn--danger" onClick={() => handleStatus("Rejected")} disabled={!!busy}>
                {busy === "Rejected" ? <Spinner /> : <LuX />} Reject
            </button>
            <button type="button" className="btn btn--sm btn--dark" onClick={() => handleStatus("confirmed")} disabled={!!busy}>
                {busy === "confirmed" ? <Spinner /> : <LuCheck />} Accept
            </button>
        </>
    );
}

const NewOrders = () => {
    const { orders, loading, error, reload: getOrdersList } = useOrders();
    const customers = useCustomerMap();
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

    const newOrders = useMemo(() => orders.filter((data) => statusKey(data.status) === "pending"), [orders]);
    const visible = useMemo(
        () => applyFilters(newOrders, filters, (o) => customers[o.customer_id]?.cust_name ?? ""),
        [newOrders, filters, customers]
    );

    return (
        <div className="container page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Admin</span>
                    <h1 className="page-header__title">Booking requests</h1>
                    <p className="page-header__lead">New requests waiting for a decision. Accepting confirms the booking for the customer.</p>
                </div>
            </div>

            {loading ? (
                <BookingGridSkeleton />
            ) : error ? (
                <ErrorState message={error} onRetry={getOrdersList} />
            ) : newOrders.length === 0 ? (
                <EmptyState icon={LuCheck} title="You're all caught up">There are no booking requests waiting for review.</EmptyState>
            ) : (
                <>
                    <BookingFilters
                        orders={newOrders}
                        filters={filters}
                        onChange={setFilters}
                        statuses={[]}
                        searchPlaceholder="Search by name, customer or venue"
                    />
                    <p className="toolbar__meta" aria-live="polite">
                        {visible.length} of {newOrders.length} pending request{newOrders.length === 1 ? "" : "s"}
                    </p>
                    {visible.length === 0 ? (
                        <EmptyState
                            icon={LuSearch}
                            title="No requests match these filters"
                            action={<button type="button" className="btn" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>}
                        />
                    ) : (
                        <div className="booking-grid">
                            {visible.map((order) => (
                                <BookingCard
                                    key={order.order_id}
                                    order={order}
                                    customerName={customers[order.customer_id]?.cust_name}
                                    actions={<ReviewActions order={order} onDone={getOrdersList} />}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default NewOrders
