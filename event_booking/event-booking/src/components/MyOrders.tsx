import React, { useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../useContext/Context';
import EventDetails from './EventDetails';
import {Order} from '../types/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrders, updateOrder } from '../service/_request';

const MyOrders = () => {

    const { showDetail, setSelectState, setShowDetail } = useContext(AppContext);
    const user_id = localStorage.getItem('flameToken');
    const [myorders, setMyOrders] = useState<Order[]>([]);

    const fetchOrders = useCallback(async () => {
        const res = await getOrders()
        if (res) setMyOrders(res)
    }, [])

    const userOrders = useMemo(() => {
        if (!user_id) return [];
        return myorders.filter((order: Order) => order.customer_id === user_id);
    }, [myorders, user_id]);

    const handleCancel = async (id: string) => {
        await updateOrder(id, { status: "cancelled" })
        toast("Order Cancelled")
        fetchOrders()
    }

    const viewOrder = (id: string) => {
        const order = myorders.filter((order: Order) => id === order.order_id);
        setSelectState(order)
        setShowDetail(true)
    }

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders]);

    return (
        <React.Fragment >

            <div className='my-order  ' >
                {!showDetail ? <div className="container-fluid text-center w-75">
                    <table className="myorder-statusbar table bg-warning pt-3 mb-2">
                        <div>#</div>
                        <div>EVENT</div>
                        <div>STATUS</div>
                        <div>#</div>
                    </table>
                    {userOrders?.map((order, idx) => (
                        <div className="myorder-statusbar table table-info pt-3  mb-2" key={order.order_id}>
                            <div>{idx + 1}</div>
                            <div>{order.event_type}</div>
                            <div>{order.status}</div>
                            <div>
                                <div className="btn preview me-2" onClick={() => viewOrder(order.order_id)}>preview</div>
                                {order.status === "pending" && <div className="btn btn-danger" onClick={() => handleCancel(order.order_id)}>cancel</div>}
                            </div>

                        </div>
                    ))}

                </div> : <EventDetails />}
            </div>
            <ToastContainer />
        </React.Fragment>
    );
}

export default MyOrders;

