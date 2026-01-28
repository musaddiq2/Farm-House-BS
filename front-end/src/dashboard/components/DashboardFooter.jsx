import React from 'react'

const DashboardFooter = () => {
    return (
        <footer className="h-12 text-center bg-white border-t flex items-center justify-between px-6 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} FunFarm. All rights reserved.</p>
        </footer>
    )
}

export default DashboardFooter