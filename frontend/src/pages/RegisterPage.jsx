import React, { useContext } from 'react'
import { Navbar } from '../components';
import { Outlet } from 'react-router-dom';
import UserContext from '../context/UserContext';

const RegisterPage = () => {
  const RegisterMenu = [
    { label: "Profile", path: "/register/profile" },
  ];

  const {user} = useContext(UserContext);

  const homePage = { label: "Register", path: "/register/" };

  return (
    <div className='bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-6 mt-29 mb-5 min-h-screen'>
      {(user?.role === "register") ? (
        <div>
          <Navbar menuItems={RegisterMenu} homePage = {homePage} />
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

export default RegisterPage