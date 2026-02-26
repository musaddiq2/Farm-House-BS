import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DashboardNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const Logout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  }

  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <>
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
        <Link to="index.html" className="navbar-brand d-flex d-lg-none me-4">
          <h2 className="text-primary mb-0"><i className="fa fa-hashtag"></i></h2>
        </Link>
        <Link
          className={`sidebar-toggler flex-shrink-0 ${sidebarOpen ? "open" : "closed"}`}
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="fa fa-bars"></i>
        </Link>


        <div className="navbar-nav align-items-center ms-auto">          
          <div className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
              <img className="rounded-circle me-lg-2" src="img/user.jpg" alt="" />
              <span className="d-none d-lg-inline-flex">{user != null && user.user.firstName + " " + user.user.lastName }</span>
            </Link>
            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
              <Link to="#" className="dropdown-item">My Profile</Link>
              {/* <Link to="#" className="dropdown-item">Settings</Link> */}
              <button onClick={Logout} className="dropdown-item">Log Out</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default DashboardNavbar;
