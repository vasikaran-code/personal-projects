import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { getCustomer } from "../service/_request";
import { getId } from "./Header";

export const Footer = () => {
  const [admin, setAdmin] = useState<boolean>(false)

  useEffect(() => {
    const id = getId()
    if (!id) return
    const fetchUser = async () => {
      try {
        const user = await getCustomer(id);
        setAdmin(user?.isAdmin ?? false)
      } catch {
        console.error("Error fetching user data");
      }
    };
    fetchUser();
  }, []);

  const navigate = useNavigate()
  
  return (
    <div >

      <footer className="footer ">
        
        {admin ? <ul className="menu d-flex">
          <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/home")} style={{ textDecoration: "none" }}>HOME</div></li>
          <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/neworder")} style={{ textDecoration: "none" }}>NEW ORDERS</div></li>
          <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/orders")} style={{ textDecoration: "none" }}>ORDERS</div></li>
        </ul> :

          <ul className="menu d-flex">
            <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/home")} style={{ textDecoration: "none" }}>HOME</div></li>
            <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/order")} style={{ textDecoration: "none" }}>BOOK NOW</div></li>
            <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/about")} style={{ textDecoration: "none" }}>ABOUT</div></li>
            <li className="nav-item "><div className="text-light ms-3" onClick={() => navigate("/myorder")} style={{ textDecoration: "none" }}>MY ORDER</div></li>
          </ul>}

          <div className=" fbar d-flex ps-3">
          <p>No.986 Anna Nagar,chennai 28</p>
        <p>&copy;2024 Inforios | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};
export default Footer;


