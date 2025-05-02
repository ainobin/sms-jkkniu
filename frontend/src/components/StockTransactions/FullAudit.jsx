import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPrint, FaFilter, FaCalendarAlt, FaTimes, FaCheckSquare, FaFileAlt } from "react-icons/fa";
import config from "../../config/config.js";
import { toast } from "react-hot-toast";
import generateAuditReportPDF from "../utils/generateAuditReportPDF.js";

const FullAudit = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productTransactions, setProductTransactions] = useState({});
    const [filteredTransactions, setFilteredTransactions] = useState({});
    const [search, setSearch] = useState("");
    const [typeSearch, setTypeSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPrinting, setIsPrinting] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportOptions, setReportOptions] = useState({
        includeSummary: true,
        reportTitle: "Full Audit Report"
    });

    // Fetch all products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${config.serverUrl}/products/getAllProducts`, {
                    withCredentials: true,
                });
                setProducts(response.data.message);
                setAvailableProducts(response.data.message);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Update available products when selected products change
    useEffect(() => {
        const updatedAvailableProducts = products.filter(
            product => !selectedProducts.some(p => p._id === product._id)
        );
        // Sort the available products alphabetically by name
        setAvailableProducts([...updatedAvailableProducts].sort((a, b) => 
            a.name.localeCompare(b.name)
        ));
    }, [selectedProducts, products]);

    // Apply filters whenever filter criteria change
    useEffect(() => {
        if (Object.keys(productTransactions).length === 0) return;
        
        const newFilteredTransactions = {};
        
        Object.keys(productTransactions).forEach(productId => {
            let filtered = [...productTransactions[productId]];
            
            // Filter by transaction type
            if (typeSearch) {
                filtered = filtered.filter(item => 
                    item.transaction_type.toLowerCase() === typeSearch.toLowerCase()
                );
            }
            
            // Filter by search term (department)
            if (search) {
                filtered = filtered.filter(item => 
                    (item.department && item.department.toLowerCase().includes(search.toLowerCase()))
                );
            }
            
            // Filter by date range
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                filtered = filtered.filter(item => new Date(item.createdAt) >= start);
            }
            
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filtered = filtered.filter(item => new Date(item.createdAt) <= end);
            }
            
            newFilteredTransactions[productId] = filtered;
        });
        
        setFilteredTransactions(newFilteredTransactions);
    }, [productTransactions, search, typeSearch, startDate, endDate]);

    // Fetch transactions for a specific product
    const fetchTransactionsForProduct = async (product, showToast = true) => {
        if (!product || !product._id) return;
        
        try {
            const response = await axios.get(`${config.serverUrl}/transactions/${product._id}`, {
                withCredentials: true
            });
            
            if (response.data.message) {
                // Sort transactions by date (newest first)
                const sortedTransactions = [...response.data.message].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                
                // Update productTransactions state with sorted data
                setProductTransactions(prev => ({
                    ...prev,
                    [product._id]: sortedTransactions
                }));
                
                // Also update filtered transactions
                setFilteredTransactions(prev => ({
                    ...prev,
                    [product._id]: sortedTransactions
                }));
                
                if (showToast) {
                    toast.success(`Loaded transactions for ${product.name}`);
                }
            }
            
            return response.data.message;
        } catch (error) {
            console.error(`Error fetching transactions for ${product.name}:`, error);
            if (showToast) {
                toast.error(`Failed to load transactions for ${product.name}`);
            }
            throw error;
        }
    };

    // Handle product selection
    const handleProductSelect = async (e) => {
        const productId = e.target.value;
        if (!productId) return;
        
        // Find the selected product
        const product = products.find(p => p._id === productId);
        if (product) {
            // Add product to selected list
            setSelectedProducts(prev => [...prev, product]);
            
            // Fetch transactions for this product
            await fetchTransactionsForProduct(product);
        }
        
        // Reset the select dropdown
        e.target.value = "";
    };

    // Handle selecting all products
    const handleSelectAllProducts = async () => {
        if (availableProducts.length === 0) {
            toast.error("No more products available to select");
            return;
        }
        
        setLoading(true);
        toast.success(`Selecting all ${availableProducts.length} available products`);
        
        // Add all available products to selected list
        setSelectedProducts(prev => [...prev, ...availableProducts]);
        
        // Fetch transactions for all products
        const promises = availableProducts.map(product => 
            fetchTransactionsForProduct(product, false) // Pass false to not show individual toasts
        );
        
        try {
            await Promise.all(promises);
            toast.success("All product transactions loaded successfully");
        } catch (error) {
            console.error("Error loading all product transactions:", error);
            toast.error("Failed to load some product transactions");
        } finally {
            setLoading(false);
        }
    };

    // Handle removing a product from selection
    const handleRemoveProduct = (productId) => {
        // Remove product from selected list
        setSelectedProducts(prev => prev.filter(p => p._id !== productId));
        
        // Remove product's transactions from state
        setProductTransactions(prev => {
            const updated = {...prev};
            delete updated[productId];
            return updated;
        });
        
        setFilteredTransactions(prev => {
            const updated = {...prev};
            delete updated[productId];
            return updated;
        });
    };

    // Handle clearing all products
    const clearAllProducts = () => {
        setSelectedProducts([]);
        setProductTransactions({});
        setFilteredTransactions({});
    };

    // Handle clearing filters
    const clearFilters = () => {
        setSearch("");
        setTypeSearch("");
        setStartDate("");
        setEndDate("");
        setFilteredTransactions({...productTransactions});
    };

    // Handle Print button click with report options
    const handlePrint = () => {
        // Check if there are any filtered transactions
        const hasTransactions = Object.values(filteredTransactions).some(
            transactions => transactions.length > 0
        );
        
        if (!hasTransactions) {
            toast.error("No transactions to print");
            return;
        }

        setReportModalOpen(true);
    };
    
    // Generate the actual PDF report
    const generateReport = () => {
        setIsPrinting(true);
        
        const filterParams = {
            startDate,
            endDate,
            typeSearch,
            search
        };
        
        try {
            const success = generateAuditReportPDF(
                filteredTransactions, 
                selectedProducts,
                filterParams
            );
            
            if (success) {
                toast.success("Report generated successfully");
                setReportModalOpen(false);
            }
        } catch (error) {
            console.error("Error generating report:", error);
            toast.error("Failed to generate report");
        } finally {
            setIsPrinting(false);
        }
    };

    // Count total transactions across all products
    const getTotalTransactionsCount = () => {
        return Object.values(filteredTransactions).reduce(
            (total, transactions) => total + transactions.length, 
            0
        );
    };
    
    return (
        <div className="px-3 sm:px-6 py-4">
            {/* Report Options Modal - positioned at top with blurred backdrop */}
            {reportModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-start justify-center pt-20 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <FaFileAlt className="mr-2 text-blue-500" /> Report Options
                            </h3>
                            <button 
                                onClick={() => setReportModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Report Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Report Title
                                </label>
                                <input
                                    type="text"
                                    value={reportOptions.reportTitle}
                                    onChange={(e) => setReportOptions({...reportOptions, reportTitle: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            {/* Include Summary Page */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="includeSummary"
                                    checked={reportOptions.includeSummary}
                                    onChange={(e) => setReportOptions({...reportOptions, includeSummary: e.target.checked})}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="includeSummary" className="ml-2 block text-sm text-gray-700">
                                    Include Summary Page
                                </label>
                            </div>
                            
                            <div className="pt-2">
                                <div className="text-xs text-gray-500 mb-2">
                                    {selectedProducts.length} product(s) selected • {getTotalTransactionsCount()} transaction(s) • 
                                    {typeSearch ? ` ${typeSearch.toUpperCase()} transactions` : ' All transaction types'}
                                    {startDate && endDate ? ` • ${startDate} to ${endDate}` : ''}
                                </div>
                                
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        onClick={() => setReportModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={generateReport}
                                        disabled={isPrinting}
                                        className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center
                                            ${isPrinting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isPrinting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FaFileAlt className="mr-2" /> 
                                                Generate PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <h1 className="text-xl sm:text-3xl text-center my-3 sm:my-5 font-semibold">
                Full Audit Report
            </h1>
            
            {/* Product selection dropdown with Select All button */}
            <div className="mb-4 w-full max-w-lg mx-auto">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Products to Audit
                </label>
                <div className="flex gap-2">
                    <select
                        onChange={handleProductSelect}
                        className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue=""
                    >
                        <option value="" disabled>-- Select a product --</option>
                        {availableProducts.map(product => (
                            <option key={product._id} value={product._id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSelectAllProducts}
                        disabled={loading || availableProducts.length === 0}
                        className={`flex items-center gap-1 px-4 py-2 rounded ${
                            loading || availableProducts.length === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        title="Select all available products"
                    >
                        <FaCheckSquare />
                        <span className="hidden sm:inline">Select All</span>
                    </button>
                </div>
            </div>
            
            {/* Selected Products Chips */}
            {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedProducts.map(product => (
                        <div 
                            key={product._id} 
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                        >
                            <span>{product.name}</span>
                            <button 
                                onClick={() => handleRemoveProduct(product._id)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        onClick={clearAllProducts}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                    >
                        Clear All
                    </button>
                </div>
            )}
            
            {/* Filters section */}
            <div className="pb-4 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-4">
                {/* Search input */}
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
                
                {/* Transaction type filter buttons */}
                <div className="flex gap-2 sm:gap-4">
                    <button
                        className={`px-3 sm:px-4 py-2 rounded-lg transition flex-1 sm:flex-none text-sm sm:text-base
                            ${typeSearch === "" ? "bg-gray-700 text-white" : "bg-gray-500 text-white hover:bg-gray-600"}`}
                        onClick={() => setTypeSearch("")}
                    >
                        All
                    </button>
                    <button
                        className={`px-3 sm:px-4 py-2 rounded-lg transition flex-1 sm:flex-none text-sm sm:text-base
                            ${typeSearch === "in" ? "bg-green-700 text-white" : "bg-green-500 text-white hover:bg-green-600"}`}
                        onClick={() => setTypeSearch("in")}
                    >
                        IN
                    </button>
                    <button
                        className={`px-3 sm:px-4 py-2 rounded-lg transition flex-1 sm:flex-none text-sm sm:text-base
                            ${typeSearch === "out" ? "bg-red-700 text-white" : "bg-red-500 text-white hover:bg-red-600"}`}
                        onClick={() => setTypeSearch("out")}
                    >
                        OUT
                    </button>
                </div>
            </div>
            
            {/* Date range filters */}
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                <div className="w-full sm:w-auto">
                    <label className="text-gray-700 text-sm font-bold mb-2 flex items-center">
                        <FaCalendarAlt className="mr-2" /> Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="shadow bg-white appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                    />
                </div>
                
                <div className="w-full sm:w-auto">
                    <label className="text-gray-700 text-sm font-bold mb-2 flex items-center">
                        <FaCalendarAlt className="mr-2" /> End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="shadow bg-white appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                    />
                </div>
                
                <div className="flex gap-2 mt-4 sm:mt-auto">
                    <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
                        onClick={clearFilters}
                    >
                        <FaFilter className="mr-2" /> Clear Filters
                    </button>
                    
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition text-sm flex items-center
                            ${isPrinting || getTotalTransactionsCount() === 0 
                                ? "opacity-50 cursor-not-allowed" 
                                : "hover:bg-blue-600"}`}
                        onClick={handlePrint}
                        disabled={isPrinting || getTotalTransactionsCount() === 0}
                    >
                        <FaPrint className="mr-2" /> Generate Report
                    </button>
                </div>
            </div>
            
            {/* Loading indicator */}
            {loading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}
            
            {/* Results section */}
            {selectedProducts.length > 0 && !loading && (
                <div className="mb-6">
                    <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center text-sm">
                        {getTotalTransactionsCount()} transactions found with the selected filters
                    </div>
                    
                    {/* Product Transaction Tables */}
                    {selectedProducts.map(product => (
                        <div key={product._id} className="mb-8">
                            <h2 className="text-lg font-semibold mb-3 bg-gray-100 p-3 rounded border-l-4 border-blue-500">
                                {product.name} ({filteredTransactions[product._id]?.length || 0} transactions)
                            </h2>
                            
                            {/* Desktop View - Table */}
                            <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden">
                                <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden table-fixed">
                                    <thead className="bg-gray-300 text-gray-700">
                                        <tr>
                                            <th className="p-4 text-center w-1/6">Date</th>
                                            <th className="p-4 text-center w-2/6">Department</th>
                                            <th className="p-4 text-center w-1/6">Transaction Type</th>
                                            <th className="p-4 text-center w-1/6">Quantity</th>
                                            <th className="p-4 text-center w-1/6">Before</th>
                                            <th className="p-4 text-center w-1/6">After</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions[product._id]?.length > 0 ? (
                                            filteredTransactions[product._id].map((item) => (
                                                <tr key={item._id} className="even:bg-gray-100 hover:bg-gray-200 transition-all">
                                                    <td className="p-4 border-b text-center text-blue-600 font-semibold">
                                                        {new Date(item.createdAt).toLocaleDateString("en-GB", { 
                                                            day: "numeric", 
                                                            month: "long", 
                                                            year: "numeric" 
                                                        })}
                                                    </td>
                                                    <td className="p-4 border-b text-center whitespace-nowrap">{item.department || "N/A"}</td>
                                                    <td className="p-4 border-b text-center">
                                                        <span
                                                            className={`px-3 py-1 text-white font-medium rounded-full 
                                                            ${item.transaction_type === "in" ? "bg-green-500" : "bg-red-500"}`}
                                                        >
                                                            {item.transaction_type}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-b text-center truncate">{item.change_stock}</td>
                                                    <td className="p-4 border-b text-center truncate">{item.previous_stock}</td>
                                                    <td className="p-4 border-b text-center truncate">{item.new_stock}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-4 text-center text-gray-500">No transactions found with the selected filters</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View - Cards */}
                            <div className="sm:hidden space-y-4">
                                {filteredTransactions[product._id]?.length > 0 ? (
                                    filteredTransactions[product._id].map((item) => (
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
                                                <span className="font-medium text-gray-700">Department:</span> {item.department || "N/A"}
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 mt-3 text-sm bg-gray-50 p-2 rounded">
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500">Quantity</div>
                                                    <div className="font-semibold">{item.change_stock}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500">Before</div>
                                                    <div className="font-semibold">{item.previous_stock}</div>
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
                                        No transactions found with the selected filters
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedProducts.length === 0 && !loading && (
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                    <p className="text-yellow-700">Select one or more products to view their transaction history</p>
                </div>
            )}
        </div>
    );
}

export default FullAudit;