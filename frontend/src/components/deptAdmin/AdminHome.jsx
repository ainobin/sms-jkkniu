import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Printer, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import UserContext from '../../context/UserContext';
import { generatePDF } from '../index.js';
import config from '../../config/config.js';

const AdminHome = () => {

  const { user } = useContext(UserContext)

  // State to store orders fetched from the API.
  const [pendingOrders, setPendingOrders] = useState([]); // Orders pending approval
  const [processdOrders, setProcessdOrders] = useState([]); // Orders already processed
  const [printingOrderId, setPrintingOrderId] = useState(null); // Track which order is being printed

  // Fetch orders from the backend when the component mounts.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/orders/getOrders/${user.id}`, {
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
        toast.error("Error while fatching data, Please Refresh..")
      }
    };
    fetchOrders();
  }, []);

  // Hook to navigate to different routes.
  const navigate = useNavigate();

  // Function to handle printing an order.
  const handlePrint = async (order) => {
    try {
      setPrintingOrderId(order._id); // Set the printing order ID
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
    } finally {
      setPrintingOrderId(null); // Reset the printing order ID
    }
  };

  // Function to render each order as a card on mobile or a table row on desktop
  const renderOrder = (order) => {
    return (
      <React.Fragment key={order._id}>
        {/* For mobile view */}
        <div className={`md:hidden mb-4 p-4 rounded-lg shadow-md overflow-hidden ${order.register_approval === null
            ? "bg-red-50"
            : order.register_approval === false
              ? "bg-red-50"
              : "bg-green-50"
          }`}>
          <div className="mb-2">
            <span className="font-semibold">Order Name:</span> {order.order_name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${order.register_approval === null
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
                  : "Approved"
              }
            </span>
          </div>
          <div className="flex flex-row gap-2 mt-3">
            <button
              onClick={() => navigate(`preview/${order._id}`, { state: { order: order } })}
              className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm flex-1"
            >
              Details
            </button>
            {order.register_approval === true && (
              <button
                onClick={() => handlePrint(order)}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center justify-center flex-1"
                disabled={printingOrderId === order._id}
              >
                {printingOrderId === order._id ? (
                  <Loader2 size={16} className="animate-spin mr-1" />
                ) : (
                  <Printer size={16} className="mr-1" />
                )}
                Print
              </button>
            )}
          </div>
        </div>

        {/* For tablet/desktop view */}
        <tr
          className={`hidden md:table-row border-b transition duration-200 ${order.register_approval === null
              ? "bg-red-50 hover:bg-red-100"
              : order.register_approval === false
                ? "bg-red-50 hover:bg-red-100"
                : "bg-green-50 hover:bg-green-100"
            }`}
        >
          <td className="px-4 py-3">{order.order_name}</td>
          <td className="px-4 py-3">
            <span
              className={`px-3 py-1 rounded-full text-black text-sm ${order.register_approval === null
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
                  : "Approved"
              }
            </span>
          </td>
          <td className="px-4 py-3">
            <button
              onClick={() => navigate(`preview/${order._id}`, { state: { order: order } })}
              className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Details
            </button>
          </td>
          <td className="px-4 py-3">
            {order.register_approval === true && (
              <button
                onClick={() => handlePrint(order)}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
                disabled={printingOrderId === order._id}
              >
                {printingOrderId === order._id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Printer size={18} />
                )}
              </button>
            )}
          </td>
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-2 sm:p-6">
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
            {pendingOrders.map(renderOrder)}
            {processdOrders.map(renderOrder)}
          </tbody>
        </table>

        {/* Mobile view - card layout */}
        <div className="md:hidden w-full">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Pending Orders</h2>
          {pendingOrders.length === 0 ? (
            <p className="text-gray-500 italic mb-4">No pending orders</p>
          ) : (
            pendingOrders.map(renderOrder)
          )}

          <h2 className="text-lg font-semibold mb-3 mt-6 text-gray-700">Processed Orders</h2>
          {processdOrders.length === 0 ? (
            <p className="text-gray-500 italic">No processed orders</p>
          ) : (
            processdOrders.map(renderOrder)
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome