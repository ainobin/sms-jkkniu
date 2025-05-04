import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config/config.js";
import { generateStockPDF } from "../utils/pdfGenerator.js";

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

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
  </svg>
);

const StockCheck = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "outOfStock", "lowStock"
  const [isPrinting, setIsPrinting] = useState(false); // For printing state
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

  // Filter items based on search input and selected filter
  const filteredItems = items.filter((item) => {
    // First apply the search filter
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    
    // Then apply the stock filter
    if (filter === "outOfStock") {
      return matchesSearch && item.current_stock === 0;
    } else if (filter === "lowStock") {
      return matchesSearch && (item.current_stock > 0 && item.current_stock <= item.threshold_point);
    } else {
      return matchesSearch;
    }
  })
  // Sort items alphabetically by name
  .sort((a, b) => a.name.localeCompare(b.name));

  // Handle filter button clicks
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Handle print button click
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      generateStockPDF(filteredItems, filter);
    } catch (error) {
      console.error("Error printing stock data:", error);
    } finally {
      setTimeout(() => setIsPrinting(false), 1500);
    }
  };

  // Navigate to transactions with reversed order for newest first
  const handleItemClick = (item) => {
    navigate(`transactions/${item.name}`, { 
      state: { 
        product: item,
        sortNewestFirst: true // Pass flag to sort transactions in reverse order
      } 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
      {/* Fullscreen Loading Overlay - matches loading style from dept admin */}
      {(isLoading || isPrinting) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-lg font-medium">
              {isPrinting ? "Generating Stock Report..." : "Loading Stock Data..."}
            </p>
            <p className="text-sm text-gray-500 mt-1">Please wait, this may take a moment</p>
          </div>
        </div>
      )}

      {/* Header with Print Button */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 sm:p-3 rounded-full mr-2 sm:mr-3 shadow-lg">
            <BoxIcon />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Stock Check</h2>
        </div>
      </div>

      {/* Search Bar with Icon */}
      <div className="relative mb-3 sm:mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search for an item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 py-2 px-3 sm:py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
        />
      </div>

      {/* Filter Buttons - Stacked on mobile, inline on desktop */}
      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-100 p-2 rounded-lg w-full sm:w-auto">
          <div className="flex items-center mb-2 sm:mb-0">
            <FilterIcon />
            <span className="ml-1 text-gray-700 font-medium">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center w-full sm:w-auto">
            <button 
              onClick={() => handleFilterChange("outOfStock")}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                filter === "outOfStock" 
                  ? "bg-red-500 text-white shadow-sm" 
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              Out of Stock
            </button>
            <button 
              onClick={() => handleFilterChange("lowStock")}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                filter === "lowStock" 
                  ? "bg-yellow-500 text-white shadow-sm" 
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }`}
            >
              Low Stock
            </button>
            <button 
              onClick={() => handleFilterChange("all")}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                filter === "all" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Products
            </button>
          </div>
        </div>
      </div>

      {/* Legend/Key for color coding - Better layout for mobile */}
      <div className="mb-3 sm:mb-4 grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 border border-red-300 rounded mr-1 sm:mr-2"></div>
          <span className="text-xs sm:text-sm font-bold text-black">Out of Stock</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-100 border border-yellow-300 rounded mr-1 sm:mr-2"></div>
          <span className="text-xs sm:text-sm font-bold text-black">Low Stock (Below Threshold)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-50 border border-emerald-200 rounded mr-1 sm:mr-2"></div>
          <span className="text-xs sm:text-sm font-bold text-black">Normal Stock</span>
        </div>
      </div>
      
      {/* Quick info text */}
      <div className="mt-2 mb-3 text-center font-bold text-xs sm:text-sm text-gray-700">
        Click on any item to view detailed transaction history
      </div>
              
      {/* Print Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={handlePrint}
          disabled={isLoading || filteredItems.length === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all shadow-sm
            ${isLoading || filteredItems.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow"
            }`}
        >
          <PrintIcon />
          <span>Print</span>
        </button>
      </div>

      {/* Stock Table - Responsive design */}
      {!isLoading && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              {/* Table Header */}
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-green-50">
                  <th className="py-3 sm:py-4 px-2 sm:px-6 text-center text-gray-700 text-xs sm:text-sm font-semibold border border-gray-200">Product Name</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-6 text-center text-gray-700 text-xs sm:text-sm font-semibold border border-gray-200">Current Stock</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => handleItemClick(item)}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md
                        ${item.current_stock === 0 
                          ? "bg-red-50 hover:bg-red-100" 
                          : item.current_stock <= item.threshold_point 
                            ? "bg-yellow-50 hover:bg-yellow-100" 
                            : "hover:bg-emerald-50"
                        }`}
                    >
                      <td className="py-2 sm:py-4 px-2 sm:px-6 border border-gray-200 text-gray-800 text-xs sm:text-sm font-medium text-center">{item.name}</td>
                      <td className="py-2 sm:py-4 px-2 sm:px-6 border border-gray-200 text-center">
                        <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                          item.current_stock === 0
                            ? "bg-red-200 text-red-800 border border-red-300"
                            : item.current_stock <= item.threshold_point
                              ? "bg-yellow-200 text-yellow-800 border border-yellow-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}>
                          {item.current_stock}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="py-4 sm:py-6 text-center text-gray-700 text-xs sm:text-sm italic border border-gray-200">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCheck;
