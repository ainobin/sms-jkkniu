import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePDF } from '../index.js';
import config from "../../config/config.js";

const ManagerHome = () => {
  // Access user context
  const { user } = useContext(UserContext);

  // State to store fetched orders
  const [pendingOrders, setPendingOrders] = useState([]); // Orders pending approval
  const [processdOrders, setProcessdOrders] = useState([]); // Orders already processed
  /**
   * useEffect Hook - Fetch orders from API on component mount
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from backend API
        const response = await axios.get(`${config.serverUrl}/orders/getAllOrders`, {
          withCredentials: true,
        });
        const fetchedOrders = (response.data.message || []).reverse(); // Reverse to show latest orders first
        // Update state with fetched orders
        setPendingOrders(
          fetchedOrders.filter(
            (order) => order.store_manager_approval === null)
        );
        setProcessdOrders(
          fetchedOrders.filter(
            (order) => order.store_manager_approval !== null)
        );
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  const navigate = useNavigate();

  /**
   * handlePrint - Function to generate and print a PDF for a specific order
   * @param {Object} order - Order details
   */
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
        order.store_manager_approval === null
          ? "bg-red-50"
          : order.store_manager_approval === true
            ? "bg-green-50"
            : "bg-red-50"
      }`}
    >
      <div className="mb-2">
        <span className="font-semibold">Order Name:</span> {order.order_name}
      </div>
      
      <div className="mb-3">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`px-2 py-0.5 rounded-full text-xs inline-block mt-1 ${
            order.store_manager_approval === null
              ? "bg-yellow-200"
              : order.store_manager_approval === true
                ? "bg-green-300"
                : "bg-red-400"
          }`}
        >
          {order.store_manager_approval === null
            ? "Pending"
            : order.store_manager_approval === true
              ? "Approved"
              : "Decline"}
        </span>
      </div>
      
      <div className="flex flex-row gap-2">
        {order.store_manager_approval === null ? (
          <button
            onClick={() => navigate(`process/${order._id}`, { state: { order: order } })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm flex-1 cursor-pointer"
          >
            Process
          </button>
        ) : (
          <button
            onClick={() => navigate(`preview/${order._id}`, { state: { order: order } })}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm flex-1 cursor-pointer"
          >
            Details
          </button>
        )}
        
        {order.register_approval === true && (
          <button
            onClick={() => handlePrint(order)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center justify-center flex-1 cursor-pointer"
          >
            <Printer size={16} className="mr-1" /> Print
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-3 sm:p-6">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-green-700">📋 Orders List</h1>

        {/* Desktop Orders Table - Hidden on mobile */}
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
            {/* Pending Orders */}
            {pendingOrders.map((order) => (
              <tr
                key={order._id}
                className={`border-b transition duration-200 ${
                  order.store_manager_approval === null
                    ? "bg-red-50 hover:bg-red-100"
                    : order.store_manager_approval === true
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-red-50 hover:bg-red-100"
                }`}
              >
                <td className="px-4 py-3">{order.order_name}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-black text-sm ${
                      order.store_manager_approval === null
                        ? "bg-yellow-200 hover:bg-yellow-300"
                        : order.store_manager_approval === true
                          ? "bg-green-300 hover:bg-green-400"
                          : "bg-red-400"
                    }`}
                  >
                    {order.store_manager_approval === null
                      ? "Pending"
                      : order.store_manager_approval === true
                        ? "Approved"
                        : "Decline"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {order.store_manager_approval === null ? (
                    <button
                      onClick={() =>
                        navigate(`process/${order._id}`, {
                          state: { order: order },
                        })
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer"
                    >
                      Process
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`preview/${order._id}`, {
                          state: { order: order },
                        })
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer"
                    >
                      Details
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {order.register_approval === true && (
                    <button
                      onClick={() => handlePrint(order)}
                      className="text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <Printer size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {/* Processed Orders */}
            {processdOrders.map((order) => (
              <tr
                key={order._id}
                className={`border-b transition duration-200 ${
                  order.store_manager_approval === null
                    ? "bg-red-50 hover:bg-red-100"
                    : order.store_manager_approval === true
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-red-50 hover:bg-red-100"
                }`}
              >
                <td className="px-4 py-3">{order.order_name}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-black text-sm ${
                      order.store_manager_approval === null
                        ? "bg-yellow-200 hover:bg-yellow-300"
                        : order.store_manager_approval === true
                          ? "bg-green-300 hover:bg-green-400"
                          : "bg-red-400"
                    }`}
                  >
                    {order.store_manager_approval === null
                      ? "Pending"
                      : order.store_manager_approval === true
                        ? "Approved"
                        : "Decline"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {order.store_manager_approval === null ? (
                    <button
                      onClick={() =>
                        navigate(`process/${order._id}`, {
                          state: { order: order },
                        })
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer"
                    >
                      Process
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`preview/${order._id}`, {
                          state: { order: order },
                        })
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 cursor-pointer"
                    >
                      Details
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {order.register_approval === true && (
                    <button
                      onClick={() => handlePrint(order)}
                      className="text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2 cursor-pointer"
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
  );
};

export default ManagerHome;