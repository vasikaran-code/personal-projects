import axios from "axios"
import { Customer, Order } from "../types/types"
import { clearSession, getAuthToken } from "../lib/session"

const ORDERS_API: string = process.env.REACT_APP_ORDER_API_URL || "http://localhost:3000/orders"
const CUSTOMERS_URL: string = process.env.REACT_APP_API_CUSTOMER_URL || "http://localhost:3000/customer"

const api = axios.create()

api.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// An expired or revoked session: sign out and return to the sign-in page.
api.interceptors.response.use(undefined, (error) => {
    if (error?.response?.status === 401 && error.config?.headers?.Authorization) {
        clearSession()
        window.location.assign("/")
    }
    return Promise.reject(error)
})

/** The API's error message for display, or the fallback when there isn't one. */
export const apiErrorMessage = (error: unknown, fallback: string): string => {
    if (!axios.isAxiosError(error) || !error.response) return fallback
    const { status, data } = error.response
    if (status >= 500) return fallback
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message
    return typeof message === "string" && message ? message : fallback
}

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get(ORDERS_API)
    return response.data
}

export const getOrder = async (order_id: string): Promise<Order> => {
    const response = await api.get(`${ORDERS_API}/${order_id}`)
    return response.data
}

export const createOrder = async (orderInput: Partial<Order>): Promise<Order> => {
    const response = await api.post(ORDERS_API, orderInput)
    return response.data
}

export const getCustomers = async () => {
    const response = await api.get(CUSTOMERS_URL)
    return response.data
}

export const getCustomer = async (customer_id: string) => {
    const response = await api.get(`${CUSTOMERS_URL}/${customer_id}`)
    return response.data
}

export const createCustomer = async (newCustomer: Pick<Customer, "cust_name" | "email" | "password">) => {
    const response = await api.post(CUSTOMERS_URL, newCustomer)
    return response.data
}

export const login = async (email: string, password: string): Promise<{ access_token: string; customer: Customer }> => {
    const response = await api.post(`${CUSTOMERS_URL}/login`, { email, password })
    return response.data
}

export const updateOrder = async (id: string, updatedOrder: Partial<Order>) => {
    const response = await api.patch(`${ORDERS_API}/${id}`, updatedOrder)
    return response.data
}
