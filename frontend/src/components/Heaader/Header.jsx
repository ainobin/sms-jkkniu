import { useState, useEffect, useRef, useActionState, useContext } from "react";
import { FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import profile_pic from "../profile_src/profile";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
// import jwt from "jsonwebtoken"

function Header() {
    // const token
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
    const {setUser} = useContext(UserContext);
    // console.log("hedar isLoggedIn:", isLoggedIn)
    const navigate = useNavigate();

    const logout = async (e) => {
        if (e) e.preventDefault();  // Only prevent if it's an event
    
        try {
            const response = await axios.get("http://localhost:3000/api/v1/users/logout", {
                withCredentials: true
            });
    
            if (response.status === 200) {
                setUser(null);  // Clear user data from context or state
                setIsLoggedIn(false);  // Set logged-in state to false
                
                // console.log("Logged out successfully!");
                
                navigate("/login");
            } else {
                console.error("Logout failed:", response);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 shadow-lg ">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">

                {/* Left: University Logo */}
                <div className="flex items-center space-x-3">
                    <Link to="/">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/7/7d/Jatiya_Kabi_Kazi_Nazrul_Islam_University_Logo.png"
                            alt="University Logo"
                            className="h-16 w-17"
                        />
                    </Link>
                </div>


                {/* Center: Project Name & University Name */}
                <div className="text-center">
                    <Link to="/">
                        <h1 className="text-3xl font-bold text-center text-green-700">
                            📦 Store Management System
                        </h1>
                    </Link>
                    <h1 className="text-md opacity-80 font-bold text-emerald-950">
                        Jatiya Kabi Kazi Nazrul Islam University, Trishal, Mymensingh
                    </h1>
                </div>

                {/* Right: Desktop Navigation & User Section */}
                <div className="hidden font-bold md:flex items-center space-x-6">
                    {[
                        { name: "About", link: "/about" },
                        { name: "Contact", link: "/contact" },
                    ].map(({ name, link }) => (
                        <Link key={name} to={link} className="hover:text-gray-300 transition">
                            {name}
                        </Link>
                    ))}

                    {/* User Profile & Login/Logout (Centered) */}
                    <div className="relative flex items-center space-x-2 justify-center">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center space-x-2 hover:text-gray-300 justify-center"
                                    role="button"
                                >
                                <FaSignInAlt size={24} />
                                <span className="hidden md:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
