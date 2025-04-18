import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePDF } from '../index.js';
import config from '../../config/config.js';

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
                const response = await axios.get(`${config.serverUrl}/orders/getAllOrders`, {
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
    const handlePrint = async (order) => {
        try {
          const registerSign = await axios.get(`${config.serverUrl}/users/getRegisterSign`, {
            withCredentials: true, 
          });
          const managerSign = await axios.get(`${config.serverUrl}/users/getManagerSign`, {
            withCredentials: true,
          });
          console.log(order.dept_id);
          
          const deptAdminSign = await axios.get(`${config.serverUrl}/users/getDeptAdminSign/${order.dept_id}`, {
            withCredentials: true,
          });
          const regSign = registerSign.data.data;
          const manSign = managerSign.data.data;
          const deptSign = deptAdminSign.data.data;
    
          generatePDF(order, regSign, manSign, deptSign); // Call the function with the order data
        toast.success("Receipt is downloading...");
        } catch (error) {
          console.error("Error fetching register signature:", error.message);
          toast.error("Error while fatching data, Please Refresh..")
          
        }
    };
    
    // Function to render order card for mobile view
    const renderOrderCard = (order) => (
        <div 
            key={order._id}
            className={`mb-4 p-4 rounded-lg shadow-md ${
                order.register_approval === null
                    ? "bg-red-50"
                    : order.register_approval === false
                    ? "bg-red-50"
                    : "bg-green-50"
            }`}
        >
            <div className="mb-2">
                <span className="font-semibold">Order Name:</span> {order.order_name}
            </div>
            
            <div className="mb-3">
                <span className="font-semibold">Status:</span>{" "}
                <span
                    className={`px-2 py-0.5 rounded-full text-xs inline-block mt-1 ${
                        order.register_approval === null
                            ? "bg-yellow-200"
                            : order.register_approval === false
                            ? "bg-red-400"
                            : "bg-green-300"
                    }`}
                >
                    {order.register_approval === null
                        ? "Pending"
                        : order.register_approval === false
                        ? "Decline"
                        : "Approved"}
                </span>
            </div>
            
            <div className="flex flex-row gap-2">
                {order.register_approval === null ? (
                    <button
                        onClick={() => navigate(`process/:${order._id}`, { state: { order: order } })}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex-1"
                    >
                        Process
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(`preview/:${order._id}`, { state: { order: order } })}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm flex-1"
                    >
                        Details
                    </button>
                )}
                
                {order.register_approval === true && (
                    <button
                        onClick={() => handlePrint(order)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center justify-center flex-1"
                    >
                        <Printer size={16} className="mr-1" /> Print
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center p-2 sm:p-6">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-3 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-green-700">📋 Orders List</h1>

                {/* Desktop table - hidden on mobile */}
                <table className="hidden md:table w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-center">
                        <tr className="text-gray-700">
                            <th className="px-4 py-3">Order Name</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Print</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Pending orders */}
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
                                <td className="px-4 py-3">{order.order_name}</td>
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

                        {/* Processed orders */}
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
                                <td className="px-4 py-3">{order.order_name}</td>
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

                {/* Mobile view - card layout */}
                <div className="md:hidden w-full">
                    <h2 className="text-lg font-semibold mb-3 text-gray-700">Pending Orders</h2>
                    {pendingOrders.length === 0 ? (
                        <p className="text-gray-500 italic mb-4">No pending orders</p>
                    ) : (
                        pendingOrders.map(renderOrderCard)
                    )}
                    
                    <h2 className="text-lg font-semibold mb-3 mt-6 text-gray-700">Processed Orders</h2>
                    {processdOrders.length === 0 ? (
                        <p className="text-gray-500 italic">No processed orders</p>
                    ) : (
                        processdOrders.map(renderOrderCard)
                    )}
                </div>
            </div>
        </div>
    )};

export default RegisterHome;