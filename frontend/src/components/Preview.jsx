import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from "../config/config.js";
import { Printer, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePDF } from './index.js';
import UserContext from "../context/UserContext";

const Preview = () => {
  const location = useLocation();
  const { state } = location;
  const { order } = state || {};
  const { user } = useContext(UserContext);
  
  // Add state for printing functionality
  const [printingOrderId, setPrintingOrderId] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const { register, control, setValue } = useForm({
    defaultValues: {
      orderItems: order.items_list || [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "orderItems",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/products/getAllProducts`,{
          withCredentials: true,
        });
        setProducts(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);

  // Function to handle printing an order
  const handlePrint = async () => {
    try {
      setPrintingOrderId(order._id);
      setIsPrinting(true);
      
      const registerSign = await axios.get(`${config.serverUrl}/users/getRegisterSign`, {
        withCredentials: true,
      });
      const managerSign = await axios.get(`${config.serverUrl}/users/getManagerSign`, {
        withCredentials: true,
      });
      
      const deptAdminSign = await axios.get(`${config.serverUrl}/users/getDeptAdminSign/${order.dept_id}`, {
        withCredentials: true,
      });
      
      const regSign = registerSign.data.data;
      const manSign = managerSign.data.data;
      const deptSign = deptAdminSign.data.data;

      generatePDF(order, regSign, manSign, deptSign);
      toast.success("Receipt is downloading...");
      
    } catch (error) {
      console.error("Error fetching signatures:", error.message);
      toast.error("Error while fetching data. Please try again.");
    } finally {
      setPrintingOrderId(null);
      setIsPrinting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white shadow-lg rounded-xl">
      {/* Loading overlay */}
      {isPrinting && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-blue-600 mb-3" />
            <p className="text-lg font-medium">Generating Receipt...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait, this may take a moment</p>
          </div>
        </div>
      )}
      
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-2 sm:mb-4">{order.order_name}</h2>
      <h2 className="text-lg sm:text-xl font-medium text-center text-gray-600 mb-3 sm:mb-4">🛠 Preview Order</h2>
      
      {/* Order details section */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 bg-gray-50 rounded-lg p-3">
        <div className="mb-2 sm:mb-0">
          <span className="font-medium">Submitted:</span> {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        <div>
          <span className="font-medium">Invoice:</span> {order.invoice_no || "N/A"}
        </div>
      </div>
      
      {/* Table header - desktop only */}
      <div className="text-center hidden md:grid grid-cols-6 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
        <span>Product Name</span>
        <span>Demand Quantity</span>
        <span>Comment</span>
        <span>Manager Alloted</span>
        <span>Manager Comment</span>
        <span>Registrar Alloted</span>
      </div>

      {/* Order items list */}
      <div className="text-center space-y-4 mt-2">
        {fields.map((item, index) => {
          const product = products.find((p) => p._id === item.id);
          
          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
              {/* Mobile: Product Name Label */}
              <div className="md:hidden text-left font-semibold text-gray-700">
                Product Name:
              </div>
              
              {/* Product Name (Readonly) */}
              <input
                type="text"
                value={item.product_name}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              
              {/* Mobile: Demand Quantity Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Demand Quantity:
              </div>
              
              {/* Demand Quantity (Readonly) */}
              <input
                type="number"
                value={item.demand_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Mobile: Comment Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Comment:
              </div>

              {/* Comment (Readonly) */}
              <input
                type="text"
                value={item.user_comment}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              
              {/* Mobile: Manager Alloted Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Manager Alloted:
              </div>

              {/* Manager Alloted Quantity (Readonly) */}
              <input
                type="number"
                value={item.manager_alloted_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Mobile: Comment Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Manager Comment:
              </div>

              {/* Comment (Readonly) */}
              <input
                type="text"
                value={item.manager_comment}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              
              {/* Mobile: Registrar Alloted Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Registrar Alloted:
              </div>

              {/* Registrar Alloted Quantity (Readonly) */}
              <input
                type="number"
                value={item.register_alloted_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              
              
              
              {/* Mobile-only divider */}
              <div className="md:hidden border-b border-gray-300 w-full my-3 col-span-1"></div>
            </div>
          );
        })}
      </div>

      {/* Status Section - Now side by side on all screen sizes */}
      <div className="pt-4 flex flex-row justify-between gap-2 sm:gap-10 bg-gray-50 mt-4 p-3 rounded-lg">
        <div className="flex flex-col items-center">
          <span className="font-medium mb-1 text-sm sm:text-base">Store manager:</span>
          <span
            className={`px-3 py-1 rounded-full text-black text-xs sm:text-sm inline-block ${
              order.store_manager_approval === null
                ? "bg-yellow-200"
                : order.store_manager_approval === false
                  ? "bg-red-400"
                  : "bg-green-300"
            }`}
          >
            {order.store_manager_approval === null
              ? "Pending"
              : order.store_manager_approval === false
                ? "Decline"
                : "Approved"
            }
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium mb-1 text-sm sm:text-base">Registrar:</span>
          <span
            className={`px-3 py-1 rounded-full text-black text-xs sm:text-sm inline-block ${
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
                : "Approved"
            }
          </span>
        </div>
      </div>

      {/* Print Button - Only show when order is approved by registrar */}
      {order.register_approval === true && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPrinting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Printer size={18} />
                Print Receipt
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Preview;