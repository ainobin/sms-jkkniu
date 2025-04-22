import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import config from "../../config/config.js";

const Transactions = () => {
    const location = useLocation();
    const { state } = location;
    const { product } = state || "";

    const [typeSearch, setTypeSearch] = useState("");
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState([]);

    // Fetch transaction data from API
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${config.serverUrl}/transactions/${product._id}`, {
                    withCredentials: true
                });
                setTransactions(response.data.message.reverse());

            } catch (error) {
                console.error("Error fetching transctions data:", error);
            }
        };
        fetchTransactions();
    }, []);

    const filteredtransactions = transactions.filter((item) =>
        item.transaction_type.toLowerCase().includes(typeSearch?.toLowerCase() || "") && // Handle typeSearch gracefully
        (search?.toLowerCase() ? item.department?.toLowerCase().includes(search.toLowerCase()) : true) // If no department search, show all
    );

    return (
        <div className="px-3 sm:px-6 py-4">
            <h1 className="text-xl sm:text-3xl text-center my-3 sm:my-5 font-semibold">
                {`${product.name} All Transactions`}
            </h1>
            
            {/* All filtering methods for transactions of a product item */}
            <div className="pb-4 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                {/* Transaction filter based on department name */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by department..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-3 py-2 w-full border-2 border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-lg placeholder-gray-500"
                    />
                    <FaSearch className="text-gray-500 min-w-6" />
                </div>
                
                {/* Transactions filter button reset, in, out */}
                <div className="flex gap-2 sm:gap-4">
                    <button
                        className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition flex-1 sm:flex-none text-sm sm:text-base"
                        onClick={() => setTypeSearch("")}
                    >
                        All
                    </button>
                    <button
                        className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition flex-1 sm:flex-none text-sm sm:text-base"
                        onClick={() => setTypeSearch("in")}
                    >
                        IN
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition flex-1 sm:flex-none text-sm sm:text-base"
                        onClick={() => setTypeSearch("out")}
                    >
                        OUT
                    </button>
                </div>
            </div>

            {/* Desktop View - Table */}
            <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden table-fixed">
                    <thead className="bg-gray-300 text-gray-700">
                        <tr>
                            <th className="p-4 text-center w-1/6">Date</th>
                            <th className="p-4 text-center w-2/6">Department</th>
                            <th className="p-4 text-center w-1/6">Transaction Type</th>
                            <th className="p-4 text-center w-1/6">Before Transactions</th>
                            <th className="p-4 text-center w-1/6">Quantity</th>
                            <th className="p-4 text-center w-1/6">After Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredtransactions.length > 0 ? (
                            filteredtransactions.map((item) => (
                                <tr key={item._id} className="even:bg-gray-100 hover:bg-gray-200 transition-all">
                                    <td className="p-4 border-b text-center text-blue-600 font-semibold">
                                        {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                    </td>
                                    <td className="p-4 border-b text-center whitespace-nowrap">{item.department}</td>
                                    <td className="p-4 border-b text-center">
                                        <span
                                            className={`px-3 py-1 text-white font-medium rounded-full 
                                            ${item.transaction_type === "in" ? "bg-green-500" : "bg-red-500"}`}
                                        >
                                            {item.transaction_type}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b text-center truncate">{item.previous_stock}</td>
                                    <td className="p-4 border-b text-center truncate">{item.change_stock}</td>
                                    <td className="p-4 border-b text-center truncate">{item.new_stock}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">No items found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="sm:hidden space-y-4">
                {filteredtransactions.length > 0 ? (
                    filteredtransactions.map((item) => (
                        <div key={item._id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-600 font-semibold">
                                    {new Date(item.createdAt).toLocaleDateString("en-GB", { 
                                        day: "numeric", 
                                        month: "short", 
                                        year: "numeric" 
                                    })}
                                </span>
                                <span
                                    className={`px-3 py-1 text-white text-xs font-medium rounded-full 
                                    ${item.transaction_type === "in" ? "bg-green-500" : "bg-red-500"}`}
                                >
                                    {item.transaction_type.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="mb-2">
                                <span className="font-medium text-gray-700">Department:</span> {item.department}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-3 text-sm bg-gray-50 p-2 rounded">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500">Before</div>
                                    <div className="font-semibold">{item.previous_stock}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-500">Quantity</div>
                                    <div className="font-semibold">{item.change_stock}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-500">After</div>
                                    <div className="font-semibold">{item.new_stock}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-4 text-center text-gray-500">
                        No items found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Transactions