import React, { useContext, useCallback, useEffect } from 'react'
import { AppContext } from '../useContext/Context'
import EventDetails from './EventDetails'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrder, getOrders, updateOrder } from '../service/_request';

const NewOrders = () => {
    const { orders, setOrders, showDetail, setShowDetail, setSelectState } = useContext(AppContext)

    const getOrdersList = useCallback(async () => {
        const res = await getOrders()
        if (res) {
            const newOrders = res.filter((data: any) => data.status === "pending")
            setOrders(newOrders)
        }
    }, [setOrders])

    const handleStatus = async (id: string, status: string) => {
        await updateOrder(id, { status })
        toast(`Order ${status}`)
        getOrdersList()
    }

    const getOrderDetails = async (id: string) => {
        const res = await getOrder(id)
        if (res) {
            setSelectState([res])
            setShowDetail(true)
        }
    }

    useEffect(() => {
        getOrdersList()
    }, [getOrdersList])

    return (
        <React.Fragment>
            
            <div className='new-order  pt-3'>
                <div className='container col-8'>
                    {orders.length > 0 ?
                        (!showDetail ? <table className=" table table-bordered table-striped table-hover">
                            <thead className='table-info'>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Event</th>
                                    <th>Date</th>
                                    <th className=''>Status</th>
                                </tr>
                            </thead>
                            {orders?.map((order, index) => (
                                <tbody key={order.order_id}>
                                    <tr>
                                        <td onClick={() => getOrderDetails(order.order_id)}>{index + 1}</td>
                                        <td onClick={() => getOrderDetails(order.order_id)}>{order.name}</td>
                                        <td onClick={() => getOrderDetails(order.order_id)}>{order.event_type}</td>
                                        <td onClick={() => getOrderDetails(order.order_id)}>{order.event_date}</td>
                                        <td className='mt-3'>
                                            <button className="btn btn-danger me-3 ps-2" onClick={() => handleStatus(order.order_id, "Rejected")}>reject</button>
                                            <button className="btn btn-info ms-3  ps-2 " onClick={() => handleStatus(order.order_id, "confirmed")}>accept</button>
                                        </td>

                                    </tr>
                                </tbody>
                            ))
                            }
                        </table> : <EventDetails />)
                        :

                        <div className='empty-list'><img src='https://cdn-icons-png.flaticon.com/512/7466/7466140.png' alt='Empty' className='img-fluid ' /></div>}

                </div> </div>
                <ToastContainer />
        </React.Fragment>
    )
}

export default NewOrders

 
