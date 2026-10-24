import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./Header"
import Footer from "./Footer"


const Layout = (props: { children: React.ReactNode }) => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <div className="app-shell">
            <a href="#main" className="skip-link">Skip to content</a>
            <Header />
            <main id="main" className="app-main">
                {props.children}
            </main>
            <Footer />
            <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar />
        </div>
    )
}

export default Layout
