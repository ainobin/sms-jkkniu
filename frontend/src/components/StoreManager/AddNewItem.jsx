import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config/config.js";

const AddNewItem = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [alert, setAlert] = useState(null);

  /**
   * onSubmit - Handles form submission and sends data to backend API
   * @param {Object} data - Form data from react-hook-form
   */
  const onSubmit = async (data) => {
    try {

      // Send a POST request with form data to the backend
      const response = await axios.post(
        `${config.serverUrl}/products/createProduct`,

        data, // No need to stringify, axios handles it

        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setAlert({ type: "success", message: "Item added successfully!" });
      toast.success("Item added successfully!");

      // Reset form fields after successful submission
      reset();
    } catch (error) {
      console.error("Error adding item:", error);
      
      // Show API response error if available, otherwise a generic message
      if(error.response?.status === 400){
        setAlert({ type: "error", message: "Name and stock are required" });
        toast.error("Name and stock are required");
        return
      }
      if(error.response?.status === 409){
        setAlert({ type: "error", message: "Item already exists" });
        toast.error("Item already exists");
        return
      }
      const errorMessage =
      error.response?.data?.message || "Failed to add item. Try again.";
      setAlert({ type: "error", message: errorMessage });
      toast.error(errorMessage);
    } finally {
      // Hide alert after 4 seconds
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div className="flex mt-7 justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Add New Item
        </h2>

        {/* Alert message */}
        {alert && (
          <div
            className={`p-3 mb-4 text-white rounded ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Form for adding new inventory item */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Item Name Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Item Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Item name is required",
                minLength: {
                  value: 3,
                  message: "Item name must be at least 3 characters",
                },
              })}
              placeholder="Enter item name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a category</option>
              <option value="Print">Print</option>
              <option value="Stationary">Stationary</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Threshold Point Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Threshold Point
            </label>
            <input
              type="number"
              {...register("threshold_point", {
                required: "Threshold point is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              placeholder="Enter threshold point"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.threshold_point && (
              <p className="text-red-500 text-sm">
                {errors.threshold_point.message}
              </p>
            )}
          </div>

          {/* Current Stock Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Current Stock
            </label>
            <input
              type="number"
              {...register("current_stock", {
                required: "Current stock is required",
                min: { value: 0, message: "Stock cannot be negative" },
              })}
              placeholder="Enter current stock"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.current_stock && (
              <p className="text-red-500 text-sm">
                {errors.current_stock.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg font-medium transition duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewItem;
