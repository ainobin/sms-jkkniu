import React from 'react'
import { Navbar } from '../components';
import { Outlet } from 'react-router-dom';

const RegisterPage = () => {
  const RegisterMenu = [
    { label: "Profile", path: "/register/profile" },
  ];

  const homePage = { label: "Register", path: "/register/" };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 mt-29 mb-5 min-h-screen">
      <Navbar menuItems={RegisterMenu} homePage = {homePage} />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default RegisterPage