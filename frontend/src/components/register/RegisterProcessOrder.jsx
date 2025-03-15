import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import toast from "react-hot-toast";

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
  const { register, control, handleSubmit, getValues } = useForm({
    defaultValues: {
      orderItems: order.items_list || [], // Populate form with order items
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "orderItems", // Manage dynamic fields for order items
  });

  const [products, setProducts] = useState([]); // State to store product details

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products/getAllProducts", {
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
  const onYesSubmit = async () => {
    const formData = getValues(); // Get all form values
    const formattedData = {
      id: order._id, // Order ID
      register_name: user.fullName, // Name of the user approving the order
      register_approval: true, // Approval status
      items_list: formData.orderItems.map(item => ({
        id: item.id,
        register_alloted_quantity: Number(item.alloted_quantity) || 0, // Allocated quantity
      })),
    };

    try {
      const response = await axios.patch("http://localhost:3000/api/v1/orders/registerAprroval", formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order Approved"); // Notify success
      navigate("/register"); // Navigate back to the register page
    } catch (error) {
      console.log("error in register submit: ", error);
      if (error.response?.status === 401) {
        toast.error("Order already Reviewed by store manager");
      }
      if (error.response?.status === 403) {
        toast.error("Allotted quantity exceeds");
        return;
      }
      toast.error("Order Approval Failed"); // Notify failure
    }
  };

  /**
   * Handles the decline of an order.
   * Sends the declined data to the server and navigates back to the register page.
   */
  const onNoSubmit = async () => {
    const formData = getValues(); // Get all form values
    const formattedData = {
      id: order._id, // Order ID
      register_name: user?.fullName || "nai", // Name of the user declining the order
      register_approval: false, // Approval status
      items_list: formData.orderItems.map(item => ({
        id: item.id,
        register_alloted_quantity: 0, // No quantity allocated
      })),
    };

    try {
      const response = await axios.patch("http://localhost:3000/api/v1/orders/registerAprroval", formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order Cancelled"); // Notify success
      navigate("/register"); // Navigate back to the register page
    } catch (error) {
      console.log("error in register submit: ", error);
      toast.error("Order Processing Failed"); // Notify failure
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">🛠 Process Order</h2>
      <h2 className="text-xl text-center text-gray-600 mb-4">{order.order_name}</h2>
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

          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-9 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
              {/* Product Name (Readonly) */}
              <input
                type="text"
                value={item.product_name}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              {/* Demand Quantity (Readonly) */}
              <input
                type="number"
                value={item.demand_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />
              {/* Manager Alloted Quantity */}
              <input
                type="number"
                value={item.manager_alloted_quantity}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
              />

              {/* Alloted Quantity (Editable in Process Mode) */}
              <input
                type="number"
                defaultValue={item.manager_alloted_quantity}
                {...register(`orderItems.${index}.alloted_quantity`)}
                className="w-full p-2 border bg-white border-gray-300 rounded-lg text-center"
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
      <div className="flex justify-between space-x-4 mt-5">
        <button
          onClick={onNoSubmit}
          className="curser-pointer bg-red-500 text-white font-bold ml-5 py-2 px-4 rounded-lg transition-transform duration-200 hover:bg-red-600"
        >
          Decline
        </button>
        <button
          onClick={onYesSubmit}
          className="bg-green-500 text-white font-bold mr-5 py-2 px-4 rounded-lg transition-transform duration-200 hover:bg-green-600"
        >
          Approved
        </button>
      </div>
    </div>
  );
};

export default RegisterProcessOrder;