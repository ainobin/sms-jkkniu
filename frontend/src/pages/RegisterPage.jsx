import React from 'react'
import { Navbar } from '../components';
import { Outlet } from 'react-router-dom';

const RegisterPage = () => {
  const RegisterMenu = [
    { label: "Profile", path: "/register/profile" },
  ];
  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 mt-29 mb-5 min-h-screen">
      <Navbar menuItems={RegisterMenu} userName={"Register"} />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default RegisterPage