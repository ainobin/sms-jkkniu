import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from "../config/config.js";

const Preview = () => {
  const location = useLocation();
  const { state } = location;
  const { order } = state || {};
  
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


  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white shadow-lg rounded-xl">
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
      <div className="text-center hidden md:grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
        <span>Product Name</span>
        <span>Demand Quantity</span>
        <span>Manager Alloted</span>
        <span>Register Alloted</span>
        <span>Comment</span>
      </div>

      {/* Order items list */}
      <div className="text-center space-y-4 mt-2">
        {fields.map((item, index) => {
          const product = products.find((p) => p._id === item.id);
          
          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
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
              
              {/* Mobile: Register Alloted Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Register Alloted:
              </div>

              {/* Register Alloted Quantity (Readonly) */}
              <input
                type="number"
                value={item.register_alloted_quantity}
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
                value={item.comment}
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
          <span className="font-medium mb-1 text-sm sm:text-base">Register:</span>
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
    </div>
  );
};

export default Preview;