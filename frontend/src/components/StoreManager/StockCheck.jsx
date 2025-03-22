import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config/config.js";

const StockCheck = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch stock data from API
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/products/getAllProducts`, {
          withCredentials: true,
        });
        setItems(response.data.message);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStock();
  }, []);

  // Filter items based on search input
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Stock Check</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for an item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border bg-white rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
     />
      {/* Stock Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b">Current Stock</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`transactions/${item.name}` , { state: { product: item } }) }
                  className="hover:bg-gray-100 cursor-pointer transition"
                >
                  <td className="p-3 border-b text-blue-600 font-semibold">{item.name}</td>
                  <td className="p-3 border-b">{item.current_stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-3 text-center text-gray-500">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockCheck;
