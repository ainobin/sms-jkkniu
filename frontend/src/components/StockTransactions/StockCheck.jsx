import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config/config.js";

// Icon imports - if you have an icon library, you can use actual imports
// These are placeholder elements for the icons
const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StockCheck = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch stock data from API
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.serverUrl}/products/getAllProducts`, {
          withCredentials: true,
        });
        setItems(response.data.message);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStock();
  }, []);

  // Filter items based on search input
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full mr-3 shadow-lg">
          <BoxIcon />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Stock Check</h2>
      </div>

      {/* Search Bar with Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search for an item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Legend/Key for color coding */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Out of Stock</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Low Stock (Below Threshold)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Normal Stock</span>
        </div>
      </div>

      {/* Stock Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-green-50">
                <th className="py-4 px-6 text-center text-gray-700 font-semibold border-b">Product Name</th>
                <th className="py-4 px-6 text-center text-gray-700 font-semibold border-b">Current Stock</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => navigate(`transactions/${item.name}`, { state: { product: item } })}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md
                      ${item.current_stock === 0 
                        ? "bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200" 
                        : item.current_stock <= item.threshold_point 
                          ? "bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200" 
                          : "hover:bg-gray-50"
                      }`}
                  >
                    <td className="py-4 px-6 border-b border-gray-100 text-blue-700 font-medium text-center">{item.name}</td>
                    <td className="py-4 px-6 border-b border-gray-100 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        item.current_stock === 0
                          ? "bg-red-100 text-red-800"
                          : item.current_stock <= item.threshold_point
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                      }`}>
                        {item.current_stock}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="py-6 text-center text-gray-500 italic">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick info text */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Click on any item to view detailed transaction history
      </div>
    </div>
  );
};

export default StockCheck;
