import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import UserContext from '../../context/UserContext';

const AdminHome = () => {

  const {user} = useContext(UserContext)

  // State to store orders fetched from the API.
  const [pendingOrders, setPendingOrders] = useState([]); // Orders pending approval
  const [processdOrders, setProcessdOrders] = useState([]); // Orders already processed

  // Fetch orders from the backend when the component mounts.
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/orders/getOrders/${user.id}`, {
          withCredentials: true,
        });
        // TODO: use .env for future.
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
  const handlePrint = (order) => {
    generatePDF([order]); // Make sure generatePDF function is defined elsewhere.
    toast.success("Recipt is Downloading...")
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
            <>
                <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 Orders List</h1>
                {/* <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 admin</h1> */}
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-center">
                        <tr className="text-gray-700 ">
                            <th className="px-4 py-3 ">Order Name</th>
                            <th className="px-4 py-3 ">Status</th>
                            <th className="px-4 py-3 ">Action</th>
                            <th className="px-4 py-3 ">Print</th>
                        </tr>
                    </thead>
                    <tbody>
                    {pendingOrders.map((order) => (
                      <tr
                          key={order._id}
                          className={`border-b transition duration-200 ${
                              order.store_manager_approval === null
                                  ? "bg-red-50 hover:bg-red-100"
                                  : order.store_manager_approval === false
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
                                  : "Approved"
                                  }
                              </span>
                          </td>
                          <td className="px-4 py-3">
                              <button
                              onClick={() => navigate(`preview/${order._id}`, { state: { order : order } })}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                              >
                                Details
                              </button>
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
                    
                    {processdOrders.map((order) => (
                      <tr
                          key={order._id}
                          className={`border-b transition duration-200 ${
                              order.store_manager_approval === null
                                  ? "bg-red-50 hover:bg-red-100"
                                  : order.store_manager_approval === false
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
                                  : "Approved"
                                  }
                              </span>
                          </td>
                          <td className="px-4 py-3">
                              <button
                              onClick={() => navigate(`preview/${order._id}`, { state: { order : order } })}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                              >
                                Details
                              </button>
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
              </>
        </div>
    </div>
  );
};

export default AdminHome
