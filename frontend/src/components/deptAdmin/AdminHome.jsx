import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../context/UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';

const AdminHome = () => {

  const { user } = useContext(UserContext);
  // console.log(user);
  const role = "manager"

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/orders/getAllOrders");
        setOrders(response.data.message || []);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };
    fetchOrders();
  }, []);

  const navigate = useNavigate();

    const handlePrint = (order) => {
        generatePDF([order]);
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
              <>
                  <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 Orders List</h1>
                  <h1 className="text-3xl font-bold mb-6 text-center text-green-700">📋 admin</h1>
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
                      {orders.map((order) => (
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
                                      order.store_manager_approval === null
                                      ? "bg-yellow-200 hover:bg-yellow-300"
                                      : order.store_manager_approval === false
                                      ? "bg-red-400"
                                      : "bg-green-300 hover:bg-green-400"
                                    }`}
                                >
                                    {order.store_manager_approval === null 
                                    ? "Pending" 
                                    : order.store_manager_approval === false
                                    ? "Decline"
                                    : "Approved"
                                    }
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <button
                                onClick={() => navigate(`preview/${order._id}`, { state: { items: order.items_list } })}
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