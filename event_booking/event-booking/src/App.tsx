import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppContext } from "./useContext/Context";
import { useState } from "react";
import { protectedRoutes, publicRoutes } from "./Routes/AllRoutes";
import { ContextValue, Order } from "./types/types";
import Layout from "./layout";

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectState, setSelectState] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState<boolean>(() => localStorage.getItem('flameToken') !== null);

  const cntxtValue: ContextValue = {
    orders,
    orderStatus,
    showDetail,
    selectState,
    isAuthenticated: isAuth,
    setOrders,
    setOrderStatus,
    setShowDetail,
    setSelectState,
    setIsAuthenticated: setIsAuth,
  };

  return (
    <div className="App">
      <AppContext.Provider value={cntxtValue}>
        <BrowserRouter>
          <Routes>
            {publicRoutes.map((route, idx) => (
              <Route path={route.path} key={idx} element={route.component} />
            ))}
            {protectedRoutes.map((route, index) => (
              <Route
                path={route.path}
                key={index}
                element={isAuth ? <Layout>{route.component}</Layout> : <Navigate to="/" />}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
