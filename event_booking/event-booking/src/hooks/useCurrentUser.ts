import { useEffect, useState } from "react";
import { getCustomer } from "../service/_request";
import { Customer } from "../types/types";

export const getId = () => localStorage.getItem("flameToken");

// Layout remounts on every route change, so cache the signed-in customer
// to avoid refetching (and flashing the wrong nav) on each navigation.
const cache = new Map<string, Customer | null>();
const inflight = new Map<string, Promise<Customer | null>>();

export const clearCurrentUser = () => {
  cache.clear();
  inflight.clear();
};

const loadCustomer = (id: string) => {
  let request = inflight.get(id);
  if (!request) {
    request = getCustomer(id)
      .then((customer: Customer | null) => {
        cache.set(id, customer ?? null);
        return customer ?? null;
      })
      .finally(() => inflight.delete(id));
    inflight.set(id, request);
  }
  return request;
};

export const useCurrentUser = () => {
  const id = getId();
  const [user, setUser] = useState<Customer | null>(() => (id ? cache.get(id) ?? null : null));
  const [loading, setLoading] = useState<boolean>(() => !!id && !cache.has(id));

  useEffect(() => {
    if (!id || cache.has(id)) return;
    let active = true;
    loadCustomer(id)
      .then((customer) => {
        if (active) setUser(customer);
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { id, user, isAdmin: !!user?.isAdmin, loading };
};
