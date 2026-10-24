import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LuInbox, LuSearch } from 'react-icons/lu'
import { useCustomerMap, useOrders } from '../hooks/useOrders'
import { statusKey } from '../lib/format'
import BookingCard, { BookingGridSkeleton } from './common/BookingCard'
import BookingFilters, { applyFilters, DEFAULT_FILTERS, Filters } from './common/BookingFilters'
import { EmptyState, ErrorState } from './common/ui'

const ManageOrders = () => {

    const [searchParams] = useSearchParams()
    const { orders, loading, error, reload: ordersList } = useOrders()
    const customerMap = useCustomerMap()
    const [filters, setFilters] = useState<Filters>(() => ({ ...DEFAULT_FILTERS, q: searchParams.get("q") ?? "" }))
    const [lastQuery, setLastQuery] = useState(searchParams.get("q"))

    // Header search navigates here with ?q=; pick up new queries while already on the page.
    if (searchParams.get("q") !== lastQuery) {
        setLastQuery(searchParams.get("q"))
        setFilters((f) => ({ ...f, q: searchParams.get("q") ?? "" }))
    }

    // Decided bookings only — pending requests live on the Requests page.
    const decided = useMemo(() => orders.filter((order) => statusKey(order.status) !== "pending"), [orders])
    const visible = useMemo(
        () => applyFilters(decided, filters, (o) => customerMap[o.customer_id]?.cust_name ?? ""),
        [decided, filters, customerMap]
    )

    return (
        <div className="container page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Admin</span>
                    <h1 className="page-header__title">All bookings</h1>
                    <p className="page-header__lead">Confirmed, cancelled and rejected bookings. Search by customer, booking name or venue.</p>
                </div>
            </div>

            {loading ? (
                <BookingGridSkeleton />
            ) : error ? (
                <ErrorState message={error} onRetry={ordersList} />
            ) : decided.length === 0 ? (
                <EmptyState icon={LuInbox} title="No bookings yet">
                    Bookings appear here once a request has been accepted, rejected or cancelled.
                </EmptyState>
            ) : (
                <>
                    <BookingFilters
                        orders={decided}
                        filters={filters}
                        onChange={setFilters}
                        statuses={["confirmed", "cancelled", "rejected"]}
                        searchPlaceholder="Search by customer, name or venue"
                    />
                    <p className="toolbar__meta" aria-live="polite">
                        Showing {visible.length} of {decided.length} booking{decided.length === 1 ? "" : "s"}
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
                                    customerName={customerMap[order.customer_id]?.cust_name}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ManageOrders
