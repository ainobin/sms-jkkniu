import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import toast from "react-hot-toast";
import config from "../../config/config.js";

/**
 * Component for processing orders by the store manager.
 * Allows the manager to approve or decline an order and allocate quantities for each product.
 */
const ManagerProcessOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { order } = state || {}; // Extract order details from navigation state
  const { user } = useContext(UserContext); // Get user details from context

  // Initialize form with default values using react-hook-form
  const { register, control, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      orderItems: order.items_list || [], // Populate order items list
    },
  });

  // Manage dynamic form fields for order items
  const { fields } = useFieldArray({
    control,
    name: "orderItems",
  });

  // State to store available products
  const [products, setProducts] = useState([]);

  /**
   * Fetch all available products from the backend when the component mounts.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${config.serverUrl}/products/getAllProducts`,
          {
            withCredentials: true,
          }
        );
        setProducts(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Handles the approval of an order by the store manager.
   * Sends an API request with approved quantities.
   */
  const onYesSubmit = handleSubmit(async (formData) => {
    const formattedData = {
      id: order._id,
      store_manager_name: user.name,
      store_manager_approval: true,
      items_list: formData.orderItems.map((item) => ({
        id: item.id,
        manager_alloted_quantity: Number(item.alloted_quantity) || 0,
        manager_comment: item.manager_comment || "",
      })),
    };

    try {
      await axios.patch(
        `${config.serverUrl}/orders/managerApproval`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Order approved successfully!");
      navigate("/store-manager");

    } catch (error) {
      console.error("Error in approval submission:", error);
      if (error.response?.status === 400) {
        toast.error("invalid Request");
        return
      }
      if (error.response?.status === 404) {
        toast.error("Order not found");
        return
      }
      if (error.response?.status === 403) {
        toast.error("Invalid allotted quantity");
        return
      }
      toast.error("Failed to approve order. Try again.");
    }
  });

  /**
   * Handles declining an order by the store manager.
   * Sends an API request to update order status.
   */
  const onNoSubmit = async () => {
    const formData = getValues(); // Get all form values
    const formattedData = {
      id: order._id,
      store_manager_name: user.name,
      store_manager_approval: false,
      items_list: formData.orderItems.map((item) => ({
        id: item.id,
        manager_alloted_quantity: 0,
        manager_comment: item.manager_comment || "",
      })),
    };

    try {
      await axios.patch(
        `${config.serverUrl}/orders/managerApproval`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Order declined successfully!");
      navigate("/store-manager");
    } catch (error) {
      console.error("Error in decline submission:", error);
      if (error.response?.status === 400) {
        toast.error("invalid Request");
        return
      }
      if (error.response?.status === 404) {
        toast.error("Order not found");
        return
      }
      toast.error("Failed to decline order. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-2 sm:mb-4">
        🛠 Process Order
      </h2>
      <h2 className="text-lg sm:text-xl text-center text-gray-600 mb-3 sm:mb-4 px-2">
        {order.order_name}
      </h2>

      {/* Table Header - Desktop only */}
      <div className="text-center hidden md:grid grid-cols-6 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
        <span>Product Name</span>
        <span>Demand Quantity</span>
        <span>Comment</span>
        <span>Current Stock</span>
        <span>Manager Alloted</span>
        <span>Manager comment</span>
      </div>

      {/* Order Items List */}
      <div className="text-center space-y-3 mt-2">
        {fields.map((item, index) => {
          const product = products.find((p) => p._id === item.id);
          const currentStock = products.find(p => p.name === item.product_name)?.current_stock || 0;

          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
            >
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
              <div className="md:hidden text-left font-semibold text-gray-700">
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
              <div className="md:hidden text-left font-semibold text-gray-700">
                Comment:
              </div>

              {/* Comment (Readonly) */}
              <input
                type="text"
                value={item.user_comment}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Mobile: Current Stock Label */}
              <div className="md:hidden text-left font-semibold text-gray-700">
                Current Stock:
              </div>

              {/* Current Stock (Readonly) */}
              <input
                type="number"
                value={currentStock}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Mobile: Alloted Quantity Label */}
              <div className="md:hidden text-left font-semibold text-gray-700">
                Manager Alloted:
              </div>

              {/* Alloted Quantity (Editable) */}
              <div className="flex flex-col">
                <input
                  type="number"
                  defaultValue={0}
                  min={0}
                  {...register(`orderItems.${index}.alloted_quantity`, {
                    validate: {
                      notExceedDemand: value =>
                        Number(value) <= Number(item.demand_quantity) ||
                        "Cannot exceed demand",
                      notExceedStock: value => {
                        return Number(value) <= currentStock ||
                          "Cannot exceed stock";
                      }
                    }
                  })}
                  className={`w-full p-2 border bg-white border-gray-300 rounded-lg text-center ${errors.orderItems?.[index]?.alloted_quantity ? "border-red-500" : ""
                    }`}
                  aria-invalid={errors.orderItems?.[index]?.alloted_quantity ? "true" : "false"}
                />
                {errors.orderItems?.[index]?.alloted_quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.orderItems[index].alloted_quantity.message}
                  </p>
                )}
              </div>

              {/* Mobile: Manager Comment Label */}
              <div className="md:hidden text-left font-semibold text-gray-700">
                Manager Comment:
              </div>
              {/* Manager Comment (Editable) */}
              <input
                type="text"
                {...register(`orderItems.${index}.manager_comment`)}
                placeholder="Optional note..."
                className="w-full bg-white p-2 border justify-items-center border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              {/* Mobile-only divider */}
              <div className="md:hidden border-b border-gray-300 w-full my-2 col-span-1"></div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between space-x-4 mt-6">
        <button
          onClick={onNoSubmit}
          className="flex-1 cursor-pointer bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:bg-red-600 text-sm sm:text-base"
        >
          Decline
        </button>
        <button
          onClick={onYesSubmit}
          className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:bg-green-600 text-sm sm:text-base"
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default ManagerProcessOrder;