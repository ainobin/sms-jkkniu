import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UserContext from "../../context/UserContext";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  // navigator
  const navigate = useNavigate()

  // Initialize form handling with react-hook-form
  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      orderItems: [{ id: "", product_name: "", demand_quantity: 0, comment: "" }],
    },
  });

  // Retrieve user details from context
  const { user } = useContext(UserContext);

  // Format current date for order naming
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  // Generate order name based on user and department details
  const Ordername = user ? `${formattedDate} ${user.department || ""}` : formattedDate;

  // Manage dynamic form fields for order items
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderItems",
  });

  // Store available products retrieved from API
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products/getAllProducts", {
          withCredentials: true,
        });
        setProducts(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        
        toast.error("Erorr while loading, Please Refresh...");
      }
    };

    fetchProducts();
  }, []);

  // Watch form field values
  const orderItems = watch("orderItems");

  /**
   * Handles product selection from dropdown
   * @param {number} index - The index of the order item in the form array
   * @param {Object} product - The selected product from dropdown
   */
  const handleProductSelect = (index, product) => {
    setValue(`orderItems.${index}._id`, product?.value || "");
    setValue(`orderItems.${index}.product_name`, product?.label || "");
  };

  // Track selected product IDs to prevent duplicate selections
  const selectedProductIds = orderItems.map((item) => item._id);

  /**
   * Handles form submission to create an order
   * @param {Object} data - Form data containing order details
   */
  const onSubmit = async (data) => {
    const formattedData = {
      order_name: Ordername,
      dept_id: user?.id,
      dept_name: user?.department,
      dept_admin_name: user?.fullName,
      items_list: data.orderItems.map(item => ({
        id: item._id,
        product_name: item.product_name,
        demand_quantity: item.demand_quantity,
        comment: item.comment
      }))
    };

    // console.log(formattedData);
    

    try {
      // Sending data via POST request
      const response = await axios.post("http://localhost:3000/api/v1/orders/createOrder", formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if(response){
        toast.success( "Order Submitted Successfully... " );
      navigate('/dept-admin');
      }
      // console.log(response);
      

    } catch (error) {
      console.error("Error while sending order data:", error);
      if(error.status < 500){
        toast.error("",error)
      }else{
        toast.error("Error while Ordering, Please Try Again...")
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">📦 Place an Order</h2>
      <h2 className="text-sm font-semibold text-center text-gray-600 mb-4">{Ordername}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Table Header */}
        <div className="text-center hidden md:grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
          <span>Product Name</span>
          <span>Quantity</span>
          <span>Availability</span>
          <span>Comment</span>
          <span>Action</span>
        </div>

        {/* Dynamic Order Items */}
        <div className="text-center space-y-3 mt-2">
          {fields.map((item, index) => {
            const selectedId = orderItems[index]?._id;
            const product = products.find((p) => p._id === selectedId);
            const currentQuantity = orderItems[index]?.demand_quantity || 0;
            const availability = product ? currentQuantity <= product.current_stock : false;

            // Filter products to prevent duplicate selections
            const filteredProducts = products
              .filter((p) => !selectedProductIds.includes(p._id) || p._id === selectedId)
              .map((p) => ({ value: p._id, label: p.name }));

            return (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
                {/* Searchable Select Dropdown */}
                <Select
                  options={filteredProducts}
                  value={filteredProducts.find((p) => p.value === selectedId) || null}
                  onChange={(selectedOption) => handleProductSelect(index, selectedOption)}
                  placeholder="product..."
                  className="w-full"
                  isSearchable
                />
                <input type="hidden" {...register(`orderItems.${index}.product_name`)} />

                {/* Quantity Input */}
                <input
                  type="number"
                  {...register(`orderItems.${index}.demand_quantity`, {
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" },
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                />

                {/* Availability Indicator */}
                <div className="flex justify-center">
                  <div
                    className={`w-3 h-3 ${availability ? "bg-green-500" : "bg-red-500"} shadow-md`}
                    title={availability ? "Available" : "Not Available"}
                  ></div>
                </div>

                {/* Comment Input */}
                <input
                  type="text"
                  {...register(`orderItems.${index}.comment`)}
                  placeholder="Optional note..."
                  className="w-full p-2 border justify-items-center border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {/* Remove Item Button */}
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-black-500 justify-items-center hover:text-red-900">
                    <MdDelete />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col md:flex-row justify-between mt-5 gap-2">
          {/* Add Item Button */}
          <button
            type="button"
            onClick={() => append({ id: "", product_name: "", demand_quantity: 0, comment: "" })}
            className="cursor-pointer w-full md:w-auto px-4 py-2 text-sm bg-blue-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-blue-600 transition"
          >
            <FaPlus size={14} /> Add Item
          </button>

          {/* Submit Button */}
          <button type="submit" className="cursor-pointer w-full md:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
