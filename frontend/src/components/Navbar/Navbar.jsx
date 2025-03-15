import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * Navbar Component
 * 
 * A responsive navigation bar that displays a menu with links to different pages.
 * 
 * Features:
 * - Displays a home page link.
 * - Shows a menu with additional navigation links.
 * - Supports a mobile-friendly dropdown menu.
 * - Uses React Router for navigation.
 * 
 * Props:
 * @param {Array} menuItems - List of menu items, each containing `path` and `label`.
 * @param {Object} homePage - The home page link, containing `path` and `label`.
 */

const Navbar = ({ menuItems, homePage }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track mobile menu visibility

  return (
    <nav className="bg-[#008337] text-white px-6 py-3 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        {/* Home Page Link */}
        <Link
          to={homePage.path}
          className="hover:bg-white/20 px-4 py-2 rounded transition"
        >
          {homePage.label}
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation Menu */}
        <ul className="hidden md:flex gap-6">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="hover:bg-white/20 px-4 py-2 rounded transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul
          className={`md:hidden mt-3 bg-white/90 backdrop-blur-md rounded-lg shadow-md p-3 
                      transition-all duration-300 ease-in-out transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
        >
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link
                to={item.path}
                className="block text-black hover:bg-[#008337] hover:text-white p-2 rounded transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

/**
 * TODO:
 * - Add a toast notification when the user navigates to a new page.
 * - Consider adding animations for smoother menu transitions.
 * - Improve accessibility by adding ARIA attributes for screen readers.
 */
