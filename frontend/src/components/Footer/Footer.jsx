import { FaLinkedin, FaFacebook, FaGlobe } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-6 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        {/* Left Section - About */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold text-green-400">About Us</h3>
          <p className="text-gray-400 mt-1 text-sm">
            This web application provides digital solutions for managing the
            <span className="font-semibold text-green-300"> Store Management System </span>
            at
            <span className="font-semibold text-green-400">
              {" "}
              Jatiya Kabi Kazi Nazrul Islam University
            </span>
            . It simplifies inventory tracking, improves operational efficiency,
            and ensures transparent and organized store management.
          </p>
        </div>

        {/* Middle Section - Quick Links (Flex Row) */}
        <div className="md:w-1/3 flex flex-col items-center">
          <h3 className="text-lg font-bold text-green-400">Quick Links</h3>
          <ul className="mt-2 flex flex-row space-x-4">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-green-300 transition text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/aboutus"
                className="text-gray-400 hover:text-green-300 transition text-sm"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-green-300 transition text-sm"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Developers & Social Media */}
        <div className="md:w-1/3 flex flex-col items-center justify-center text-center md:items-end">
          <h3 className="text-lg font-bold text-green-400">Developers</h3>
          <a
            href="/developers"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium text-sm px-3 py-2 rounded-lg mt-2 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            <span className="flex items-center gap-2">
              <SiGooglemeet /> Team 👥
            </span>
          </a>

          <h3 className="text-lg font-bold text-green-400 mt-4">Follow Us</h3>
          <div className="flex space-x-3 mt-2">
            <a
              href="https://www.linkedin.com/school/jkkniu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-gray-400 text-lg hover:text-green-300 transition" />
            </a>
            <a
              href="https://jkkniu.edu.bd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe className="text-gray-400 text-lg hover:text-green-300 transition" />
            </a>
            <a
              href="https://www.facebook.com/officialjkkniu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-gray-400 text-lg hover:text-green-300 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-xs mt-4 border-t border-gray-700 pt-2 w-full">
        © {new Date().getFullYear()} Store Management System. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;