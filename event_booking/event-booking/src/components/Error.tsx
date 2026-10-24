import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LuArrowLeft } from 'react-icons/lu'
import { AppContext } from '../useContext/Context'
import { Brand } from '../layout/Header'

const Error = () => {
  const { isAuthenticated } = useContext(AppContext)
  const home = isAuthenticated ? "/home" : "/"

  return (
    <div className="not-found">
      <div className="container not-found__top">
        <Brand to={home} />
      </div>
      <main className="container not-found__body">
        <span className="not-found__code" aria-hidden="true">404</span>
        <h1>This page isn't on the guest list</h1>
        <p>The link may be broken, or the page may have moved.</p>
        <Link to={home} className="btn btn--dark btn--lg">
          <LuArrowLeft /> {isAuthenticated ? "Back to home" : "Go to sign in"}
        </Link>
      </main>
    </div>
  )
}

export default Error
