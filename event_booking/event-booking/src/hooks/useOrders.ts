import { useCallback, useEffect, useState } from "react";
import { getCustomers, getOrders } from "../service/_request";
import { Customer, Order } from "../types/types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const res = await getOrders();
      setOrders(res ?? []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("We couldn't load bookings. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { orders, setOrders, loading, error, reload };
};

export const useCustomerMap = (enabled = true) => {
  const [customers, setCustomers] = useState<Record<string, Customer>>({});

  useEffect(() => {
    if (!enabled) return;
    getCustomers()
      .then((res: Customer[]) => {
        const map: Record<string, Customer> = {};
        (res ?? []).forEach((c) => {
          map[c.customer_id] = c;
        });
        setCustomers(map);
      })
      .catch((err) => console.error("Error fetching customers:", err));
  }, [enabled]);

  return customers;
};
