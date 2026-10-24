import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../useContext/Context'
import EventDetails from './EventDetails'
import { Customer } from '../types/types'
import { getCustomers, getOrder, getOrders } from '../service/_request'

const ManageOrders = () => {

    const { orders, showDetail, setShowDetail, setOrders, setSelectState } = useContext(AppContext)

    const [input, setInput] = useState("")
    const [allOrders, setAllOrders] = useState(orders)
    const [customers, setCustomers] = useState<Customer[]>([])

    const customerMap = useMemo(() => {
        const map: Record<string, Customer> = {}
        customers.forEach(c => { map[c.customer_id] = c })
        return map
    }, [customers])

    const ordersList = async () => {
        const res = await getOrders()
        if (res) {
            setOrders(res)
            setAllOrders(res)
        }
    }

    const confirmedOrders = orders.filter((order) => order.status === "confirmed")
    const rejectedOrders = orders.filter((order) => order.status === "Rejected")
    const cancelledOrders = orders.filter((order) => order.status === "cancelled")

    const orderDetail = async (id: string) => {
        const res = await getOrder(id)
        if (res) {
            setSelectState([res])
            setShowDetail(true)
        }
    }

    const searchByName = () => {
        if (!input) {
            setOrders(allOrders)
            return
        }
        const selCustomer = customers?.filter(customer => customer.cust_name.toLowerCase().includes(input.toLowerCase()))
        if (!selCustomer || selCustomer.length === 0) {
            alert("No matching customer found")
            setOrders(allOrders)
        } else {
            const matchedIds = new Set(selCustomer.map(c => c.customer_id))
            setOrders(allOrders.filter(order => matchedIds.has(order.customer_id)))
        }
    }

    useEffect(() => {
        ordersList()
        const fetchCustomers = async () => {
            const res = await getCustomers()
            if (res) setCustomers(res)
        }
        fetchCustomers()
    }, [])

    return (
        <React.Fragment>

            <div className='orders pt-4 text-center'>
                <div className="head ">
                    <div className='search-bar'>
                        <input
                            type="text"
                            className='form-control'
                            placeholder='User Name'
                            id='cust-id'
                            value={input}
                            name='input'
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="btn btn-primary" onClick={searchByName}> search </div>
                    </div>
                </div>

                {confirmedOrders.length > 0 || rejectedOrders.length > 0 || cancelledOrders.length > 0 ? (
                    !showDetail ? (
                        <div className='container '>
                            {confirmedOrders.length > 0 && <strong className='fs-5'>CONFIRMATION</strong>}
                            {confirmedOrders.length > 0 && (
                                <table className="table table-bordered table-striped table-hover">
                                    <thead className='table-info'>
                                        <tr>
                                            <th>#</th>
                                            <th>User Name</th>
                                            <th>Name</th>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    {confirmedOrders.map((order, index) =>{ 
                                        return  (
                                        <tbody key={order.order_id}>
                                            <tr onClick={() => orderDetail(order.order_id)}>
                                                <td>{index + 1}</td>
                                                <td>{customerMap[order.customer_id]?.cust_name?.toUpperCase()}</td>
                                                <td>{order.name}</td>
                                                <td>{order.event_type}</td>
                                                <td>{order.event_date}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        </tbody>
                                    )})}
                                </table>
                            )}
                            {cancelledOrders.length > 0 && <strong className='fs-5'>CANCELLATION</strong>}
                            {cancelledOrders.length > 0 && (
                                <table className="table table-bordered table-striped table-hover">
                                    <thead className='table-warning'>
                                        <tr>
                                            <th>#</th>
                                            <th>User Name</th>
                                            <th>Name</th>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    {cancelledOrders.map((order, index) => (
                                        <tbody key={order.order_id}>
                                            <tr onClick={() => orderDetail(order.order_id)}>
                                                <td>{index + 1}</td>
                                                <td>{customerMap[order.customer_id]?.cust_name?.toUpperCase() || "Loading..."}</td>
                                                <td>{order.name}</td>
                                                <td>{order.event_type}</td>
                                                <td>{order.event_date}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                            )}
                            {rejectedOrders.length > 0 && <strong className='fs-5'>REJECTION</strong>}
                            {rejectedOrders.length > 0 && (
                                <table className="table table-bordered table-striped table-hover">
                                    <thead className='table-danger'>
                                        <tr>
                                            <th>#</th>
                                            <th>User Name</th>
                                            <th>Name</th>
                                            <th>Event</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    {rejectedOrders.map((order, index) => (
                                        <tbody key={order.order_id}>
                                            <tr onClick={() => orderDetail(order.order_id)}>
                                                <td>{index + 1}</td>
                                                <td>{customerMap[order.customer_id]?.cust_name?.toUpperCase() || "Loading..."}</td>
                                                <td>{order.name}</td>
                                                <td>{order.event_type}</td>
                                                <td>{order.event_date}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                            )}
                        </div>
                    ) : <EventDetails />
                ) : <img src='https://cdn-icons-png.flaticon.com/256/7486/7486744.png' alt='empty' />}
            </div>

        </React.Fragment>
    )
}

export default ManageOrders
