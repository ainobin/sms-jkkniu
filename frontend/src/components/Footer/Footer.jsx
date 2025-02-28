import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-6 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        
        {/* Left Section - About */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold text-green-400">About Us</h3>
          <p className="text-gray-400 mt-1 text-sm">
            We are CSE students from <span className="font-semibold text-green-300">Jatiya Kabi Kazi Nazrul Islam University</span>,
            working on modern solutions to enhance business operations.
          </p>
        </div>

        {/* Middle Section - Quick Links (Flex Row) */}
        <div className="md:w-1/3 flex flex-col items-center">
          <h3 className="text-lg font-bold text-green-400">Quick Links</h3>
          <ul className="mt-2 flex flex-row space-x-4">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-green-300 transition text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Developers & Social Media */}
        <div className="md:w-1/3 flex flex-col items-center md:items-end">
          <h3 className="text-lg font-bold text-green-400">Developers</h3>
          <a href="/developers" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg mt-2 text-sm transition">
            Meet the Team
          </a>

          <h3 className="text-lg font-bold text-green-400 mt-4">Follow Us</h3>
          <div className="flex space-x-3 mt-2">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-gray-400 text-lg hover:text-green-300 transition" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-gray-400 text-lg hover:text-green-300 transition" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-gray-400 text-lg hover:text-green-300 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-xs mt-4 border-t border-gray-700 pt-2 w-full">
        © {new Date().getFullYear()} Store Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
