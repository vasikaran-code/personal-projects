export interface Order {
  order_id: string;
  status: string;
  name: string;
  event_type: string;
  event_date: string;
  level: string;
  contact: string;
  alternative_contact: string;
  mail_id: string;
  customer_id: string;
  venue: string;
}

export interface ContextValue {
  orders: Order[];
  orderStatus: string;
  showDetail: boolean;
  selectState: any[];
  isAuthenticated: boolean;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setOrderStatus: React.Dispatch<React.SetStateAction<string>>;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectState: React.Dispatch<React.SetStateAction<any[]>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Customer {
  customer_id: string;
  cust_name: string;
  email: string;
  password: string;
  isAdmin?: boolean; 
  confirmPwd?:string;
}


export interface EventInput {
  name: string;
  event_type: string;
  event_date: string;
  level: string;
  contact: string;
  alternative_contact: string;
  mail_id: string;
  venue:string;
}


// export function businessUserId () {
//   return Math.random().toString(36).substr(2, 10);
// }


