import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LuLogOut, LuMenu, LuSearch, LuX } from 'react-icons/lu'
import { AppContext } from '../useContext/Context'
import { clearCurrentUser, getId, useCurrentUser } from '../hooks/useCurrentUser'
import { clearSession } from '../lib/session'
import { initials } from '../lib/format'

export { getId }

const customerLinks = [
  { to: "/home", label: "Discover" },
  { to: "/order", label: "Book an event" },
  { to: "/myorder", label: "My bookings" },
  { to: "/about", label: "Contact" },
]

const adminLinks = [
  { to: "/home", label: "Overview" },
  { to: "/neworder", label: "Requests" },
  { to: "/orders", label: "All bookings" },
]

export const Brand = ({ to = "/home" }: { to?: string }) => (
  <Link to={to} className="brand" aria-label="VK Weddings home">
    <span className="brand__mark" aria-hidden="true">VK</span>
    <span className="brand__text">
      <span className="brand__name">VK Weddings</span>
      <span className="brand__tag">Events &amp; venues</span>
    </span>
  </Link>
)

const HeaderSearch = ({ isAdmin, id }: { isAdmin: boolean; id: string }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    const path = isAdmin ? "/orders" : "/myorder"
    navigate(q ? `${path}?q=${encodeURIComponent(q)}` : path)
    setQuery("")
  }

  return (
    <form className="header-search field__control" role="search" onSubmit={handleSubmit}>
      <LuSearch className="field__icon" aria-hidden="true" />
      <label htmlFor={id} className="visually-hidden">Search bookings</label>
      <input
        id={id}
        type="search"
        className="input input--with-icon"
        placeholder={isAdmin ? "Search bookings or customers" : "Search your bookings"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

const AccountSummary = ({ name, isAdmin }: { name?: string; isAdmin: boolean }) => (
  <>
    <span className="avatar" aria-hidden="true">{initials(name)}</span>
    <span className="account__name">
      <span>{name ?? "Signed in"}</span>
      <span className="account__role">{isAdmin ? "Administrator" : "Customer"}</span>
    </span>
  </>
)

const Header = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { setIsAuthenticated } = useContext(AppContext)
  const { user, isAdmin } = useCurrentUser()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = isAdmin ? adminLinks : customerLinks

  const handleLogout = () => {
    clearSession()
    clearCurrentUser()
    setIsAuthenticated(false)
    navigate("/")
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />

        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="site-nav__link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <HeaderSearch isAdmin={isAdmin} id="header-search" />

        <div className="account">
          <AccountSummary name={user?.cust_name} isAdmin={isAdmin} />
          <button type="button" className="icon-btn" onClick={handleLogout} aria-label="Sign out" title="Sign out">
            <LuLogOut />
          </button>
        </div>

        <button
          type="button"
          className="icon-btn menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <LuX /> : <LuMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="container">
            <HeaderSearch isAdmin={isAdmin} id="mobile-search" />
            <nav className="mobile-menu__nav" aria-label="Mobile">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mobile-menu__footer">
              <div className="account">
                <AccountSummary name={user?.cust_name} isAdmin={isAdmin} />
              </div>
              <button type="button" className="btn" onClick={handleLogout}>
                <LuLogOut /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
