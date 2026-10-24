import { Link } from "react-router-dom";
import { LuMapPin } from "react-icons/lu";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Brand } from "./Header";

export const Footer = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Brand />
          <p className="site-footer__about">
            Weddings, receptions and family celebrations — request your date and track every booking in one place.
          </p>
          <address className="site-footer__address">
            <LuMapPin aria-hidden="true" />
            <span>No.986 Anna Nagar, Chennai 28</span>
          </address>
        </div>

        {isAdmin ? (
          <nav aria-label="Footer">
            <h2>Manage</h2>
            <ul className="site-footer__links">
              <li><Link to="/home">Overview</Link></li>
              <li><Link to="/neworder">Booking requests</Link></li>
              <li><Link to="/orders">All bookings</Link></li>
            </ul>
          </nav>
        ) : (
          <nav aria-label="Footer">
            <h2>Explore</h2>
            <ul className="site-footer__links">
              <li><Link to="/home">Discover</Link></li>
              <li><Link to="/order">Book an event</Link></li>
              <li><Link to="/myorder">My bookings</Link></li>
            </ul>
          </nav>
        )}

        <div>
          <h2>Help</h2>
          <ul className="site-footer__links">
            <li><Link to="/about">Contact us</Link></li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>&copy;2024 Inforios | All Rights Reserved</span>
        <span>No.986 Anna Nagar, Chennai 28</span>
      </div>
    </footer>
  );
};
export default Footer;
