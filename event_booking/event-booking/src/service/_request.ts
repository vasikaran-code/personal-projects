import axios from "axios"
import { Order } from "../types/types"

const ORDERS_API: string = process.env.REACT_APP_ORDER_API_URL || "http://localhost:3000/orders"
const CUSTOMERS_URL: string = process.env.REACT_APP_API_CUSTOMER_URL || "http://localhost:3000/customer"

export const getOrders = async (): Promise<Order[]> => {
    const response = await axios.get(ORDERS_API)
    return response.data
}

export const getOrder = async (order_id: string): Promise<Order> => {
    const response = await axios.get(`${ORDERS_API}/${order_id}`)
    return response.data
}

export const createOrder = async (orderInput: Partial<Order>): Promise<Order> => {
    const response = await axios.post(ORDERS_API, orderInput)
    return response.data
}

export const getCustomers = async () => {
    const response = await axios.get(CUSTOMERS_URL)
    return response.data
}

export const getCustomer = async (customer_id: string) => {
    const response = await axios.get(`${CUSTOMERS_URL}/${customer_id}`)
    return response.data
}

export const createCustomer = async (newCustomer: any) => {
    const response = await axios.post(CUSTOMERS_URL, newCustomer)
    return response.data
}

export const updateOrder = async (id: string, updatedOrder: Partial<Order>) => {
    const response = await axios.patch(`${ORDERS_API}/${id}`, updatedOrder)
    return response.data
}
