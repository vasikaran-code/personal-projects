import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomer } from '../service/_request'
import { AppContext } from '../useContext/Context'

export const getId = () => localStorage.getItem("flameToken")

const Header = () => {

  const navigate = useNavigate()
  const [admin, setAdmin] = useState<boolean>(false)
  const { setIsAuthenticated } = useContext(AppContext)

  const handleLogout = () => {
    localStorage.removeItem("flameToken")
    setIsAuthenticated(false)
    navigate("/")
  }

  useEffect(() => {
    const id = getId()
    if (!id) return
    const fetchUser = async () => {
      try {
        const res = await getCustomer(id);
        setAdmin(res?.isAdmin ?? false)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser()
  }, [])

  return (
    <div >
      <nav className="navbar navbar-expand-lg " >
        <div className="container-fluid  pe-3"   >
          <div className="navbar-brand d-flex  ms-4 p-0">&nbsp; <img src='https://toppng.com/uploads/preview/vk-vk-png-logo-11562915083k8kbfowfmf.png' alt='logo' className='logo'  />
            {/* <span style={{fontFamily:"monospace",fontSize:"0.8rem"}}> Weddings</span> */}
          </div>
          <div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            {admin ?
              <div className="collapse navbar-collapse text-center" id="navbarNav" >
                <ul className="navbarNav nav-list d-flex list-unstyled  mb-2  ">
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/home")} style={{ textDecoration: "none" }}>HOME</div></li>
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/neworder")} style={{ textDecoration: "none" }}>NEW ORDERS</div></li>
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/orders")} style={{ textDecoration: "none" }}>ORDERS</div></li>

                </ul>
                <div className="nav-item btn btn-danger text-center text-light ms-3"><div className="logout " onClick={handleLogout}>Logout</div></div>
              </div> :
              <div className="collapse navbar-collapse text-center" id="navbarNav" >
                <ul className="navbarNav nav-list d-flex list-unstyled  mb-2  ">
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/home")} style={{ textDecoration: "none" }}>HOME</div></li>
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/order")} style={{ textDecoration: "none" }}>BOOK NOW</div></li>
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/myorder")} style={{ textDecoration: "none" }}>MY ORDER</div></li>
                  <li className="nav-item "><div className="text-primary ms-3" onClick={() => navigate("/about")} style={{ textDecoration: "none" }}>CONTACT</div></li>
                </ul>
                <div className="nav-item btn btn-danger text-center text-light ms-3"><div className="logout " onClick={handleLogout}>Logout</div></div>

              </div>}
          </div>
        </div>
      </nav >
    </div >
  )
}

export default Header
