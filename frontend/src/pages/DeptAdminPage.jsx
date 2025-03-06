import React from 'react'
import { Navbar } from '../components';
import { Outlet } from 'react-router-dom';

const DeptAdminPage = () => {

  const deptAdminMenu = [
    { label: "Order Now", path: "/dept-admin/order-now" },
    { label: "Profile", path: "/dept-admin/profile" },
  ];

  const homePage = { label: "Depertment Admin", path: "/dept-admin/" };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 mt-29 mb-5 min-h-screen">
        <Navbar menuItems={deptAdminMenu} homePage = {homePage}  />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default DeptAdminPage