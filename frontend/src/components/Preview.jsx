import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Preview = () => {
  const location = useLocation();
  const { state } = location;
  const { order } = state || {};

  const { register, control, setValue } = useForm({
    defaultValues: {
      orderItems: order.items_list || [],
    },
  });
  console.log(order);


  const { fields } = useFieldArray({
    control,
    name: "orderItems",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products/getAllProducts");
        setProducts(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">{order.order_name}</h2>
      <h2 className="text-xl font- text-center text-gray-600 mb-4">🛠 Preview Order</h2>
      <div className="flex justify-between">
        <div className="p-5">
          Submited: {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        <div className="p-5">
          Invoice : {order.invoice_no || "N/A"}
        </div>
      </div>
      <div className="text-center hidden md:grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
        <span>Product Name</span>
        <span>Demand Quantity</span>
        <span>Manager Alloted</span>
        <span>Register Alloted</span>
        <span>Comment</span>
      </div>

      <div className="text-center space-y-3 mt-2">
        {fields.map((item, index) => {
          const product = products.find((p) => p._id === item.id);
          // const stock = product ? product.current_stock : "N/A";

          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-9 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
              {/* Product Name (Readonly) */}
              <input
                type="text"
                value={item.product_name}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              {/*Demand Quantity (Readonly) */}
              <input
                type="number"
                value={item.demand_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Alloted Quantity (Editable in Process Mode) */}
              <input
                type="number"
                value={item.manager_alloted_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              <input
                type="number"
                value={item.register_alloted_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Comment (Readonly) */}
              <input
                type="text"
                value={item.comment}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
            </div>
          );
        })}

      </div>

      <div className="pt-5 flex gap-10">
        <div className="flex gap-2">
          Store manager:
          <span
            className={`px-3 py-1 rounded-full text-black text-sm ${order.store_manager_approval === null
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
        </div>
        <div className="flex gap-2">
          Register :
          <span
            className={`px-3 py-1 rounded-full text-black text-sm ${order.store_manager_approval === null
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
        </div>
      </div>

    </div>

  );
};

export default Preview;
