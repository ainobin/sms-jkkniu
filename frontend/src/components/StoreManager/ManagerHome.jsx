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
      // console.log(order.dept_id);
      
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

  return (
    <div className="flex flex-col items-center justify-center  p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <>
          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 Orders List</h1>
          {/* <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 Manager</h1> */}

          {/* Orders Table */}
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
              {pendingOrders.map((order) => (
                <tr
                  key={order._id}
                  className={`border-b transition duration-200 ${order.store_manager_approval === null
                    ? "bg-red-50 hover:bg-red-100"
                    : order.store_manager_approval === true
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-red-50 hover:bg-red-100"
                    }`}
                >
                  {/* Order Name */}
                  <td className="px-4 py-3 ">{order.order_name}</td>

                  {/* Order Status */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-black text-sm ${order.store_manager_approval === null
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

                  {/* Action Button */}
                  <td className="px-4 py-3 text-center">
                    {order.store_manager_approval === null ? (
                      <button
                        onClick={() =>
                          navigate(`process/${order._id}`, {
                            state: { order: order },
                          })
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
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
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                      >
                        Details
                      </button>
                    )}
                  </td>

                  {/* Print Button */}
                  <td className="px-4 py-3 text-center">
                    {order.register_approval === true && (
                      <button
                        onClick={() => handlePrint(order)}
                        className="text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
                      >
                        <Printer size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {processdOrders.map((order) => (
                <tr
                  key={order._id}
                  className={`border-b transition duration-200 ${order.store_manager_approval === null
                    ? "bg-red-50 hover:bg-red-100"
                    : order.store_manager_approval === true
                      ? "bg-green-50 hover:bg-green-100"
                      : "bg-red-50 hover:bg-red-100"
                    }`}
                >
                  {/* Order Name */}
                  <td className="px-4 py-3 ">{order.order_name}</td>

                  {/* Order Status */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-black text-sm ${order.store_manager_approval === null
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

                  {/* Action Button */}
                  <td className="px-4 py-3 text-center">
                    {order.store_manager_approval === null ? (
                      <button
                        onClick={() =>
                          navigate(`process/${order._id}`, {
                            state: { order: order },
                          })
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
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
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                      >
                        Details
                      </button>
                    )}
                  </td>

                  {/* Print Button */}
                  <td className="px-4 py-3 text-center">
                    {order.register_approval === true && (
                      <button
                        onClick={() => handlePrint(order)}
                        className="text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
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

export default ManagerHome;
