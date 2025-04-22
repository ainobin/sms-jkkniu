import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config.js';
import toast from 'react-hot-toast';

const Allocation = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDeptName, setSelectedDeptName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSearched, setIsSearched] = useState(false);

    // Fetch all departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${config.serverUrl}/users/all-dept`, {
                    withCredentials: true
                });
                
                // Now we expect to receive department objects with _id and department name
                const allDepts = response.data.data || [];
                setDepartments(allDepts);
            } catch (error) {
                console.error('Error fetching departments:', error);
                toast.error('Failed to load departments. Please try again.');
            }
        };

        fetchDepartments();
    }, []);

    // Handle department selection
    const handleDeptChange = (e) => {
        const deptId = e.target.value;
        setSelectedDept(deptId);
        
        // Find the selected department name for display purposes
        const selectedDept = departments.find(dept => dept._id === deptId);
        setSelectedDeptName(selectedDept ? selectedDept.department : '');
    };

    // Handle search button click
    const handleSearch = async () => {
        if (!selectedDept) {
            toast.error('Please select a department first');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${config.serverUrl}/transactions/dept/${encodeURIComponent(selectedDept)}`, {
                withCredentials: true
            });
            
            // Fix: Use response.data.message instead of response.data.data to access the transactions
            setTransactions(response.data.message || []);
            setIsSearched(true);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error(error.response?.data?.message || 'Failed to load transactions');
            setTransactions([]);
            setIsSearched(true);
            setLoading(false);
        }
    };

    return (
        <div className="px-3 sm:px-6 py-4 max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-3xl text-center my-3 sm:my-5 font-semibold text-green-700">
                Department Allocation Transactions
            </h1>
            
            {/* Department Selection */}
            <div className="mb-6 bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-full sm:w-1/2">
                    <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
                        Select Department
                    </label>
                    <select 
                        id="department"
                        value={selectedDept}
                        onChange={handleDeptChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">-- Select Department --</option>
                        {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                                {dept.department}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="w-full sm:w-auto sm:self-end">
                    <button
                        onClick={handleSearch}
                        disabled={loading || !selectedDept}
                        className={`w-full sm:w-auto px-6 py-3 rounded-md text-white font-medium text-center
                            ${loading || !selectedDept
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            } transition duration-200`}
                    >
                        {loading ? 'Loading...' : 'Search Transactions'}
                    </button>
                </div>
            </div>
            
            {/* Transactions Table */}
            {isSearched && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <h2 className="text-lg sm:text-xl p-4 bg-gray-50 border-b font-semibold text-center">
                        {selectedDeptName} Transactions
                    </h2>
                    
                    {transactions.length > 0 ? (
                        <>
                            {/* Desktop View - Table */}
                            <div className="hidden sm:block">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-200 text-gray-700">
                                        <tr>
                                            <th className="p-4 text-center">Date</th>
                                            <th className="p-4 text-center">Product Name</th>
                                            <th className="p-4 text-center">Transaction Type</th>
                                            <th className="p-4 text-center">Quantity</th>
                                            <th className="p-4 text-center">Before</th>
                                            <th className="p-4 text-center">After</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((item) => (
                                            <tr key={item._id} className="even:bg-gray-50 hover:bg-gray-100 transition-all">
                                                <td className="p-3 border-b text-center text-blue-600 font-medium">
                                                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </td>
                                                <td className="p-3 border-b text-center">{item.product_name}</td>
                                                <td className="p-3 border-b text-center">
                                                    <span className={`px-3 py-1 text-white font-medium rounded-full 
                                                        ${item.transaction_type === "in" 
                                                            ? "bg-green-500" 
                                                            : "bg-red-500"
                                                        }`}
                                                    >
                                                        {item.transaction_type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-3 border-b text-center font-semibold">{item.change_stock}</td>
                                                <td className="p-3 border-b text-center">{item.previous_stock}</td>
                                                <td className="p-3 border-b text-center">{item.new_stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View - Cards */}
                            <div className="sm:hidden space-y-4 p-3">
                                {transactions.map((item) => (
                                    <div key={item._id} className="bg-white shadow-sm border rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-blue-600 font-semibold">
                                                {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </span>
                                            <span className={`px-2 py-1 text-white text-xs font-medium rounded-full 
                                                ${item.transaction_type === "in" ? "bg-green-500" : "bg-red-500"}`}
                                            >
                                                {item.transaction_type.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <span className="font-medium text-gray-700">Product:</span> {item.product_name}
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
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No transactions found for this department
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Allocation;