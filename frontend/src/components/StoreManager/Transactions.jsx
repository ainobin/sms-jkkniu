import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import axios from "axios";
import { FaSearch } from "react-icons/fa";


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
                const response = await axios.get(`http://localhost:3000/api/v1/transactions/${product._id}`);
                setTransactions(response.data.message.reverse());

            } catch (error) {
                console.error("Error fetching transctions data:", error);
            }
        };
        fetchTransactions();
    }, []);

    console.log(transactions);

    const filteredtransactions = transactions.filter((item) =>
        item.transaction_type.toLowerCase().includes(typeSearch?.toLowerCase() || "") && // Handle typeSearch gracefully
        (search?.toLowerCase() ? item.department?.toLowerCase().includes(search.toLowerCase()) : true) // If no department search, show all
    );



    return (
        <div>
            <h1 className="text-3xl flex justify-center m-5 font-semibold">
                {`${product.name} All Transactions`}
            </h1>
            {/* All filtering methods for transcations of a product item */}
            <div className="pb-4 flex justify-between gap-4">
                {/* Transaction filter based on department name */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search by department name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-3 pt-1 pb-1 w-full min-w-100 border-2 border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg placeholder-gray-500"
                    />
                    <FaSearch className="text-gray-500" />
                </div>
                {/* Transactions filter button reset, in, out */}
                <div className="flex gap-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2"
                        onClick={() => setTypeSearch("")}
                    >
                        Reset
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ml-2"
                        onClick={() => setTypeSearch("in")}
                    >
                        IN
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => setTypeSearch("out")}
                    >
                        OUT
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* All transactions table here */}
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
        </div>
    )
}

export default Transactions