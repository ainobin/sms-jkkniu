import React from 'react'
import { useState } from "react";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header className="bg-[#3F9A0D] flex items-center justify-between p-4 text-white relative">
      {/* Left Logo */}
      <img src="Jatiya_Kabi_Kazi_Nazrul_Islam_University_Logo.png" alt="University Logo" className="w-0.5 h-fit  flex-1 text-center" />

      {/* Center Title */}
      <div className="text-center ml-0 flex-10">
        <h1 className="text-xl ">Jatiya Kabi Kazi Nazrul Islam University</h1>
        <h2 className="text-4xl font-bold">Store Management System</h2>
      </div>

      {/* Right Profile Dropdown */}
      <div className="relative flex-1">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none cursor-pointer">
          <img src="signature.jpg" alt="Profile" className="h-25 w-25 rounded-full border-2 border-white" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => setMenuOpen(false)}>Profile</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => setMenuOpen(false)}>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header