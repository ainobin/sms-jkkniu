import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import toast from "react-hot-toast";
import config from '../../config/config.js';

/**
 * Component to process an order by either approving or declining it.
 * Displays order details and allows the user to allocate quantities for each item.
 */
const RegisterProcessOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { order } = state || {}; // Order details passed via route state
  const { user } = useContext(UserContext); // Get user details from context

  // Initialize form with default values
  const { register, control, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      orderItems: order.items_list || [], // Populate form with order items
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "orderItems", // Manage dynamic fields for order items
  });

  const [products, setProducts] = useState([]); // State to store product details

  // Add loading state variables
  const [approvingOrder, setApprovingOrder] = useState(false);
  const [decliningOrder, setDecliningOrder] = useState(false);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/products/getAllProducts`, {
          withCredentials: true,
        });
        setProducts(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);

  /**
   * Handles the approval of an order.
   * Sends the approved data to the server and navigates back to the register page.
   */
  const onYesSubmit = handleSubmit(async (formData) => {
    setApprovingOrder(true); // Set loading state when starting approval
    const formattedData = {
      id: order._id, // Order ID
      register_name: user.fullName, // Name of the user approving the order
      register_approval: true, // Approval status
      items_list: formData.orderItems.map(item => ({
        id: item.id,
        register_alloted_quantity: Number(item.alloted_quantity) || 0, // Allocated quantity
        register_comment: item.manager_comment || "", // Forward the modified comment
      })),
    };

    try {
      const response = await axios.patch(`${config.serverUrl}/orders/registerAprroval`, formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order Approved"); // Notify success
      navigate("/registrar"); // Navigate back to the registrar page
    } catch (error) {
      // console.log("error in registrar submit: ", error);
      if (error.response?.status === 401) {
        toast.error("Order already Reviewed by store manager");
      }
      if (error.response?.status === 403) {
        toast.error("Allotted quantity exceeds");
        return;
      }
      toast.error("Order Approval Failed"); // Notify failure
    } finally {
      setApprovingOrder(false); // Reset loading state regardless of outcome
    }
  });

  /**
   * Handles the decline of an order.
   * Sends the declined data to the server and navigates back to the register page.
   */
  const onNoSubmit = async () => {
    setDecliningOrder(true); // Set loading state when starting decline
    const formData = getValues(); // Get all form values
    const formattedData = {
      id: order._id, // Order ID
      register_name: user?.fullName || "nai", // Name of the user declining the order
      register_approval: false, // Approval status
      items_list: formData.orderItems.map(item => ({
        id: item.id,
        register_alloted_quantity: 0, // No quantity allocated
        register_comment: item.manager_comment || "", // Forward the modified comment
      })),
    };

    try {
      const response = await axios.patch(`${config.serverUrl}/orders/registerAprroval`, formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order Cancelled"); // Notify success
      navigate("/registrar"); // Navigate back to the registrar page
    } catch (error) {
      // console.log("error in registrar submit: ", error);
      toast.error("Order Processing Failed"); // Notify failure
    } finally {
      setDecliningOrder(false); // Reset loading state regardless of outcome
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-2 sm:mb-4">🛠 Process Order</h2>
      <h2 className="text-lg sm:text-xl text-center text-gray-600 mb-3 sm:mb-4">{order.order_name}</h2>
      
      {/* Desktop table header - hidden on mobile */}
      <div className="text-center hidden md:grid grid-cols-6 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
        <span>Product Name</span>
        <span>Demand Quantity</span>
        <span>Manager Alloted</span>
        <span>Current Stock</span>
        <span>Registrar Alloted</span>
        <span>Comment</span>
      </div>

      <div className="text-center space-y-3 mt-2">
        {fields.map((item, index) => {
          const product = products.find((p) => p._id === item.id);
          const currentStock = products.find(p => p.name === item.product_name)?.current_stock || 0;

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
              
              {/* Mobile: Manager Alloted Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Manager Alloted:
              </div>
              
              {/* Manager Alloted Quantity */}
              <input
                type="number"
                value={item.manager_alloted_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              
              {/* Mobile: Current Stock Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Current Stock:
              </div>
              
              {/* Current Stock (Readonly) */}
              <input
                type="number"
                value={currentStock}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Mobile: Register Alloted Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Registrar Alloted:
              </div>
              
              {/* Alloted Quantity (Editable in Process Mode) */}
              <div className="flex flex-col">
                <input
                  type="number"
                  defaultValue={item.manager_alloted_quantity}
                  min={0}
                  {...register(`orderItems.${index}.alloted_quantity`, {
                    validate: {
                      notExceedStock: value => {
                        const currentStock = products.find(p => p.name === item.product_name)?.current_stock || 0;
                        return Number(value) <= currentStock ||
                          "Cannot exceed current stock";
                      },
                      notExceedDemand: value => {
                        return Number(value) <= item.demand_quantity ||
                          "Cannot exceed demand quantity";
                      }
                    },
                    valueAsNumber: true,
                  })}
                  className={`w-full p-2 border bg-white border-gray-300 rounded-lg text-center ${
                    errors.orderItems?.[index]?.alloted_quantity ? "border-red-500" : ""
                  }`}
                />
                {errors.orderItems?.[index]?.alloted_quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.orderItems[index].alloted_quantity.message}
                  </p>
                )}
              </div>

              {/* Mobile: Comment Label */}
              <div className="md:hidden text-left font-semibold text-gray-700 mt-2">
                Comment:
              </div>
              
              {/* Comment (Editable) */}
              <input
                type="text"
                {...register(`orderItems.${index}.manager_comment`)}
                defaultValue={item.manager_comment}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-center"
              />
              
              {/* Mobile-only divider */}
              <div className="md:hidden border-b border-gray-300 w-full my-3 col-span-1"></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center sm:justify-between gap-4 sm:gap-6 mt-5">
        <button
          onClick={onNoSubmit}
          disabled={approvingOrder || decliningOrder}
          className="w-full sm:w-auto bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:bg-red-600 text-sm sm:text-base cursor-pointer flex items-center justify-center"
        >
          {decliningOrder ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Decline"
          )}
        </button>
        <button
          onClick={onYesSubmit}
          disabled={approvingOrder || decliningOrder}
          className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 hover:bg-green-600 text-sm sm:text-base cursor-pointer flex items-center justify-center"
        >
          {approvingOrder ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Approve"
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterProcessOrder;