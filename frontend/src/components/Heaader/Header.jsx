import { useContext, useState } from "react";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import config from "../../config/config.js";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

function Header() {
    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Context and navigation
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const logout = async (e) => {
        if (e) e.preventDefault();  // Only prevent if it's an event
    
        try {
            const response = await axios.get(`${config.serverUrl}/users/logout`, {
                withCredentials: true
            });
    
            if (response.status === 200) {
                setUser(null);  // Clear user data from context or state
                setIsLoggedIn(false);  // Set logged-in state to false
                setMobileMenuOpen(false); // Close mobile menu after logout
                navigate("/login");
            } else {
                console.error("Logout failed:", response);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Navigation links to be used in both desktop and mobile menus
    const navLinks = [
        { name: "About", link: "/aboutus" },
        { name: "Contact", link: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 shadow-lg">
            <div className="container mx-auto flex items-center justify-between py-2 md:py-4 px-3 md:px-6">

                {/* Left: University Logo */}
                <div className="flex items-center">
                    <Link to="/">
                        <img
                            src="/Jatiya_Kabi_Kazi_Nazrul_Islam_University_Logo.png"
                            alt="University Logo"
                            className="h-10 w-10 md:h-16 md:w-17"
                        />
                    </Link>
                </div>

                {/* Center: Project Name & University Name */}
                <div className="text-center flex-1 mx-2">
                    <Link to="/">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-green-700 line-clamp-1">
                            📦 Store Management System
                        </h1>
                    </Link>
                    <h1 className="text-xs md:text-base opacity-80 font-bold text-emerald-950 line-clamp-1">
                        Jatiya Kabi Kazi Nazrul Islam University
                    </h1>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 rounded-md"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation & User Section */}
                <div className="hidden md:flex items-center space-x-6 font-bold">
                    {navLinks.map(({ name, link }) => (
                        <Link key={name} to={link} className="hover:text-green-600 transition">
                            {name}
                        </Link>
                    ))}

                    {/* User Profile & Login/Logout */}
                    <div className="relative flex items-center space-x-2 justify-center">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center space-x-2 hover:text-gray-300 justify-center"
                                    role="button"
                                >
                                <CgLogOut size={24} />
                                <span className="hidden md:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="flex items-center space-x-2 hover:text-green-600 cursor-pointer justify-center"
                                    role="button"
                                >
                                <CgLogIn size={24} />
                                <span className="hidden md:inline">Login</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white/90 backdrop-blur-sm shadow-lg animate-fade-in">
                    <div className="px-4 py-3 space-y-3 flex flex-col">
                        {navLinks.map(({ name, link }) => (
                            <Link 
                                key={name} 
                                to={link} 
                                className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-md"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {name}
                            </Link>
                        ))}
                        
                        {/* Login/Logout Button */}
                        {isLoggedIn ? (
                            <button
                                onClick={() => logout()}
                                className="flex items-center cursor-pointer space-x-2 py-2 px-3 text-green-600 hover:bg-gray-100 rounded-md"
                            >
                                <CgLogOut size={20} />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate("/login");
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center space-x-2 py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-md"
                            >
                                <CgLogIn size={20} />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Header;