import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';

const RegisterHome = () => {
    // Access user context
    const { user } = useContext(UserContext);
    const role = "manager"; // Example role, can be dynamic

    // State variables to manage orders
    const [pendingOrders, setPendingOrders] = useState([]); // Orders pending approval
    const [processdOrders, setProcessdOrders] = useState([]); // Orders already processed

    // Fetch orders from the API when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch orders from the backend API
                const response = await axios.get("http://localhost:3000/api/v1/orders/getAllOrders", {
                    withCredentials: true
                });
                const fetchedOrders = (response.data.message || []).reverse(); // Reverse to show latest orders first

                // Update state with fetched orders
                setPendingOrders(
                    fetchedOrders.filter(
                        (order) => order.register_approval === null && order.store_manager_approval !== null
                    )
                );
                setProcessdOrders(
                    fetchedOrders.filter(
                        (order) => order.register_approval !== null && order.store_manager_approval !== null
                    )
                );
            } catch (error) {
                // Log error if the API call fails
                console.error("Error fetching orders:", error.message);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array ensures this runs only once

    const navigate = useNavigate();

    // Handle printing an order by generating a PDF
    const handlePrint = (order) => {
        generatePDF([order]);
    };

    return (
        <div className="flex flex-col items-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <>
                    {/* Page title */}
                    <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 Orders List</h1>

                    {/* Orders table */}
                    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-center">
                            <tr className="text-gray-700">
                                <th className="px-4 py-3">Order Name</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Print</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render pending orders */}
                            {pendingOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className={`border-b transition duration-200 ${
                                        order.register_approval === null
                                            ? "bg-red-50 hover:bg-red-100"
                                            : order.register_approval === false
                                            ? "bg-red-50 hover:bg-red-100"
                                            : "bg-green-50 hover:bg-green-100"
                                    }`}
                                >
                                    {/* Order name */}
                                    <td className="px-4 py-3">{order.order_name}</td>

                                    {/* Order status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-black text-sm ${
                                                order.register_approval === null
                                                    ? "bg-yellow-200 hover:bg-yellow-300"
                                                    : order.register_approval === false
                                                    ? "bg-red-400"
                                                    : "bg-green-300 hover:bg-green-400"
                                            }`}
                                        >
                                            {order.register_approval === null
                                                ? "Pending"
                                                : order.register_approval === false
                                                ? "Decline"
                                                : "Approved"}
                                        </span>
                                    </td>

                                    {/* Action button */}
                                    <td className="px-4 py-3">
                                        {order.register_approval === null ? (
                                            <button
                                                onClick={() =>
                                                    navigate(`process/:${order._id}`, { state: { order: order } })
                                                }
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                                            >
                                                Process
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    navigate(`preview/:${order._id}`, { state: { order: order } })
                                                }
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                                            >
                                                Details
                                            </button>
                                        )}
                                    </td>

                                    {/* Print button */}
                                    <td className="px-4 py-3">
                                        {order.register_approval === true && (
                                            <button
                                                onClick={() => handlePrint(order)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
                                            >
                                                <Printer size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {/* Render processed orders */}
                            {processdOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className={`border-b transition duration-200 ${
                                        order.register_approval === null
                                            ? "bg-red-50 hover:bg-red-100"
                                            : order.register_approval === false
                                            ? "bg-red-50 hover:bg-red-100"
                                            : "bg-green-50 hover:bg-green-100"
                                    }`}
                                >
                                    {/* Order name */}
                                    <td className="px-4 py-3">{order.order_name}</td>

                                    {/* Order status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-black text-sm ${
                                                order.register_approval === null
                                                    ? "bg-yellow-200 hover:bg-yellow-300"
                                                    : order.register_approval === false
                                                    ? "bg-red-400"
                                                    : "bg-green-300 hover:bg-green-400"
                                            }`}
                                        >
                                            {order.register_approval === null
                                                ? "Pending"
                                                : order.register_approval === false
                                                ? "Decline"
                                                : "Approved"}
                                        </span>
                                    </td>

                                    {/* Action button */}
                                    <td className="px-4 py-3">
                                        {order.register_approval === null ? (
                                            <button
                                                onClick={() =>
                                                    navigate(`process/:${order._id}`, { state: { order: order } })
                                                }
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                                            >
                                                Process
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    navigate(`preview/:${order._id}`, { state: { order: order } })
                                                }
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                                            >
                                                Details
                                            </button>
                                        )}
                                    </td>

                                    {/* Print button */}
                                    <td className="px-4 py-3">
                                        {order.register_approval === true && (
                                            <button
                                                onClick={() => handlePrint(order)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
                                            >
                                                <Printer size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            </div>
        </div>
    );
};

export default RegisterHome;