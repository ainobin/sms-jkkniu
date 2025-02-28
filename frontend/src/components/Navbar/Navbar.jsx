import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({ menuItems, userName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#008337] text-white px-6 py-3 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo / Title */}
        <h2 className="text-lg font-semibold">{userName}</h2>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
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
        <ul className="md:hidden mt-3 bg-white/90 backdrop-blur-md rounded-lg shadow-md p-3">
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
