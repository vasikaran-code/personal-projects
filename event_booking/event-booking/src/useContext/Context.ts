import  { createContext } from "react";
import  { ContextValue } from "../types/types";



export const AppContext = createContext<ContextValue>({
  orders: [],
  orderStatus: "",
  showDetail: false,
  selectState: [],
  isAuthenticated: false,
  setOrders: () => {},
  setOrderStatus: () => {},
  setShowDetail: () => {},
  setSelectState: () => {},
  setIsAuthenticated: () => {},
});
