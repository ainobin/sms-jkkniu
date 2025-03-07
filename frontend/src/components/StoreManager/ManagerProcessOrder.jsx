import { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";

const ManagerProcessOrder = () => {
  const location = useLocation();
  const { state } = location;
  const { order } = state || {};
  const { user } = useContext(UserContext);

  // console.log("order: ", order._id);
  

  const { register, control, handleSubmit, getValues } = useForm({
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
        const response = await axios.get("http://localhost:3000/api/v1/products/getAllProducts");
        setProducts(response.data?.message || []);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    fetchProducts();
  }, []);
  const onYesSubmit = async () => {
    const formData = getValues(); // Get all form values
    const formattedData = {
      id: order._id, // Example ID, replace dynamically if needed
      store_manager_name: user.name,
      store_manager_approval: true,
      items_list: formData.orderItems.map(item => ({
        id: item.id,
        manager_alloted_quantity: Number(item.alloted_quantity) || 0,
      })),
    };

    try {
      const response = await axios.patch("http://localhost:3000/api/v1/orders/managerApproval", formattedData ,{
        headers : {
          "Content-Type" : "application/json",
          
        },
      })

      // console.log("Response from server:", response.data);
      
    } catch (error) {
      console.log("error in register submit: ", error);
    }
  };

  const onNoSubmit = async () => {
    const formData = getValues(); // Get all form values
    const formattedData = {
      id: order._id, // Example ID, replace dynamically if needed
      store_manager_name: user.name,
      store_manager_approval: false,
      items_list: formData.orderItems.map(item => ({
        id: item.id,
        manager_alloted_quantity: 0,
      })),
      
    };
    try {
      const response = await axios.patch("http://localhost:3000/api/v1/orders/managerApproval", formattedData ,{
        headers : {
          "Content-Type" : "application/json",
        },
      })

      // console.log("Response from server:", response.data);
      
    } catch (error) {
      console.log("error in register submit: ", error);
    }
  };
  


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">🛠 Process Order</h2>
        <div className="text-center hidden md:grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
          <span>Product Name</span>
          <span>Demand Quantity</span>
          <span>Current stock</span>
          <span>Manager Alloted</span>
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
                {/*curent stock Quantity (Readonly) */}
                <input
                    type="number"
                    value={products.find((p) => p.name === item.product_name)?.current_stock || 0}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-center"
                />

                {/* Alloted Quantity (Editable in Process Mode) */}
            
                <input
                type="number"
                defaultValue={0}
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
      <div class="flex justify-between space-x-4 mt-5">
        <button 
            onClick={onNoSubmit}
            class="curser-pointer bg-red-500 text-white font-bold ml-5 py-2 px-4 rounded-lg transition-transform duration-200 hover:bg-red-600"
        >
            Decline
        </button>
        <button 
            onClick={onYesSubmit}
            class="bg-green-500 text-white font-bold mr-5 py-2 px-4 rounded-lg transition-transform duration-200 hover:bg-green-600"
        >
            Approved
        </button>
      </div>
    </div>
  );
};

export default ManagerProcessOrder;
