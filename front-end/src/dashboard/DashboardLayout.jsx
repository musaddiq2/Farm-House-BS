import React from 'react'
import Sidebar from './components/Sidebar'
import DashboardNavbar from './components/DashboardNavbar'
import DashboardFooter from './components/DashboardFooter'
import { Outlet } from 'react-router-dom'
import './assets/css/style.css'


const DashboardLayout = () => {
    return (
        <>
            <div className="d-flex min-vh-100">
                <Sidebar />
                <div className="content flex-fill d-flex flex-column">
                    <DashboardNavbar />
                    <main className="ms-5 flex-fill p-4 bg-light">
                        <Outlet />
                    </main>
                    <DashboardFooter />
                </div>
            </div>
        </>
    )
}

export default DashboardLayout