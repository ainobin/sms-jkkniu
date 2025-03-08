import React, { useContext } from 'react'
import { Navbar } from '../components/index.js';
import { Outlet } from 'react-router-dom';
import UserContext from '../context/UserContext';

const StoreManagerPage = () => {
  const {user} = useContext(UserContext);
  const storeManagerMenu = [
    { label: "Register New User", path: "/store-manager/register-new-user" },
    { label: "Add New Item", path: "/store-manager/add-item" },
    { label: "Stock Check", path: "/store-manager/stock-check" },
    { label: "Restock", path: "/store-manager/restock" },
    { label: "Profile", path: "/store-manager/profile" },
  ];
  const homePage = { label: "Store Manager", path: "/store-manager/" };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 mt-29 mb-5 min-h-screen">
      {(user?.role === "manager") ? (
        <div>
          <Navbar menuItems={storeManagerMenu} homePage = {homePage} />
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      ) : (
      <div>
        <div className='text-2xl text-center'>
          Not Authenticate...
        </div>
        <div className='text-xl mt-5 text-center'>
          please login to get access. If you find any difficulty contact to the Authority.
        </div>
      </div>
      )}
    </div>
  )
}

export default StoreManagerPage