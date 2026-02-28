import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 mx-3 px-4 py-3 rounded-lg 
    font-medium transition whitespace-nowrap
   text-white
   ${isActive ? "bg-green-600" : "hover:bg-green-600"}`;

export default function Sidebar() {

    const navigate = useNavigate();

    // Parse the stored login response. The backend returns { token, user: { ... } },
    // so the role may be at `stored.user.role` instead of `stored.role`.
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    const userRole = stored?.user?.role ?? stored?.role ?? null;

    useEffect(() => {
        // If nothing stored, redirect to login
        if (!stored) {
            navigate('/login');
        }
    }, [navigate, stored]);

    return (
        <>
            <div className="sidebar pe-4 pb-3">
                <nav className="navbar bg-light navbar-light">
                    <Link to="/super-admin" className="navbar-brand mx-4 mb-3">
                        <h3 className="text-primary"><i className="fa fa-hashtag me-2"></i>Farmhouse</h3>
                    </Link>

                    <div className="navbar-nav w-100">
                        <NavLink to="/super-admin" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                            <i className="fa fa-tachometer-alt me-2"></i>Dashboard
                        </NavLink>
                        {userRole === 'superadmin' && (
                            <>
                                <div className="nav-item dropdown">
                                    <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                        <i className="fas fa-house me-2"></i>
                                        Farmhouse Management
                                    </Link>
                                    <div className="dropdown-menu bg-transparent border-0">
                                        <NavLink to="/super-admin/add-farmhouses" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                                            <i className="fas fa-plus me-2"></i>Add Farmhouse
                                        </NavLink>
                                        <NavLink to="/super-admin/view-farmhouses" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                                            <i className="fas fa-eye me-2"></i>View Farmhouses
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="nav-item dropdown">
                                    <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                        <i className="fas fa-house me-2"></i>
                                        User Management
                                    </Link>
                                    <div className="dropdown-menu bg-transparent border-0">
                                        <NavLink to="/super-admin/add-users" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                                            <i className="fas fa-plus me-2"></i>Add User
                                        </NavLink>
                                        <NavLink to="/super-admin/view-users" className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}>
                                            <i className="fas fa-eye me-2"></i>View Users
                                        </NavLink>
                                    </div>
                                </div>
                            </>
                        )}
                        <Link to="form.html" className="nav-item nav-link"><i className="fa fa-keyboard me-2"></i>Forms</Link>
                        <Link to="table.html" className="nav-item nav-link"><i className="fa fa-table me-2"></i>Tables</Link>
                        <Link to="chart.html" className="nav-item nav-link"><i className="fa fa-chart-bar me-2"></i>Charts</Link>
                        {/* <div className="nav-item dropdown">
                            <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown"><i className="far fa-file-alt me-2"></i>Pages</Link>
                            <div className="dropdown-menu bg-transparent border-0">
                                <Link to="signin.html" className="dropdown-item">Sign In</Link>
                                <Link to="signup.html" className="dropdown-item">Sign Up</Link>
                                <Link to="404.html" className="dropdown-item">404 Error</Link>
                                <Link to="blank.html" className="dropdown-item">Blank Page</Link>
                            </div>
                        </div> */}
                    </div>
                </nav>
            </div>
        </>
    );
}