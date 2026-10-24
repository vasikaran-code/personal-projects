import Home from "../components/Home";
import NewOrders from "../components/NewOrders";
import OrderInput from "../components/OrderInput";
import Error from "../components/Error";
import Login from "../components/Login";
import MyOrders from "../components/MyOrders";
import ManageOrders from "../components/ManageOrders";
import EventDetails from "../components/EventDetails";

import Contact from "../components/Contact";


const protectedRoutes = [

    { path: "/home", component: <Home /> },
    { path: "/neworder", component: <NewOrders /> },
    { path: "/orders", component: <ManageOrders /> },
    { path: "/order", component: <OrderInput /> },
    { path: "/myorder", component: <MyOrders /> },
    { path: "/booking/:id", component: <EventDetails /> },
    { path: "/about", component: <Contact /> }]

const publicRoutes = [
    { path: "/", component: <Login /> },
    { path: "*", component: <Error /> }
]

export { publicRoutes, protectedRoutes }
