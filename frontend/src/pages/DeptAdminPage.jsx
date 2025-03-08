import React, { useContext } from 'react'
import { Navbar } from '../components';
import { Outlet } from 'react-router-dom';
import UserContext from '../context/UserContext';

const DeptAdminPage = () => {
  const {user} = useContext(UserContext);

  const deptAdminMenu = [
    { label: "Order Now", path: "/dept-admin/order-now" },
    { label: "Profile", path: "/dept-admin/profile" },
  ];

  const homePage = { label: "Depertment Admin", path: "/dept-admin/" };

  return (
    <div className='bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 mt-29 mb-5 min-h-screen'>
      {(user?.role === "deptAdmin") ? (<div>
        <Navbar menuItems={deptAdminMenu} homePage = {homePage}  />
      <div className="p-4">
        <Outlet />
      </div>
    </div>) : (
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

export default DeptAdminPage