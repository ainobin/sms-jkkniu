import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const Restock = () => {
  // Initialize form control, form handling functions, and state variables 
  const { control, handleSubmit, setValue, watch } = useForm();
  const [products, setProducts] = useState([]); // Stores fetched product list
  const [currentQuantity, setCurrentQuantity] = useState(0); // Tracks selected product's stock

  // Fetch all products from the database when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products/getAllProducts");
        setProducts(response.data.message); // Store fetched products in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Watch for changes in the selected product
  const selectedProduct = watch("selectedProduct");

  useEffect(() => {
    if (selectedProduct) {
      setCurrentQuantity(selectedProduct.current_stock); // Update stock when product changes
    }
  }, [selectedProduct]);

  // Handle form submission to update stock quantity
  const onSubmit = async (data) => {
    // Validate input: Ensure a product is selected and restock quantity is valid
    if (!data.selectedProduct || data.restockQuantity < 1) {
      toast.error("Please select a product and enter a valid restock quantity.");
      return;
    }

    // Calculate updated stock quantity
    const updatedStock = Number(currentQuantity) + Number(data.restockQuantity);

    try {
      // Send PATCH request to update stock in database
      const response = await axios.patch("http://localhost:3000/api/v1/products/stockUpdate", {
        name: data.selectedProduct.label, // Product name
        stock: Number(updatedStock), // Updated stock value
      });

      // Check response status and update UI accordingly
      if (response.status === 200) {
        toast.success("Stock successfully updated!");
        setValue("restockQuantity", ""); // Reset input field
        setCurrentQuantity(updatedStock); // Update state with new stock value
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Restock Inventory</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product Selection Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Product Name</label>
            <Controller
              name="selectedProduct"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                    current_stock: product.current_stock, // Store current stock as extra metadata
                  }))}
                  className="w-full"
                  placeholder="Select a product"
                  isSearchable
                  required
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "white", // Keep the control background white
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "white", // Keep the dropdown menu background white
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#f0f0f0" : "white", // Light gray on hover, white otherwise
                      color: "black", // Ensure text color is black
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "black", // Ensure selected value text is black
                    }),
                  }}
                />
              )}
            />
          </div>

          {/* Display Current Quantity (Read-only) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Current Quantity</label>
            <input
              type="number"
              value={currentQuantity}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          {/* Input Field for Restock Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Restock Quantity</label>
            <Controller
              name="restockQuantity"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                  required
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all duration-200 text-lg font-semibold"
          >
            Restock
          </button>
        </form>
      </div>
    </div>
  );
};

export default Restock;

/*
Best Practices Not Followed:
1. `current_stock` is stored as extra metadata inside the select options.
   - This could be refactored to use a state that updates when the selected product changes.
   
2. API URL should be stored in environment variables instead of hardcoding `"http://localhost:3000/api/v1/products/getAllProducts"`.

3. `alert()` is used for error handling, which may not be ideal. Instead, UI-based error messages (e.g., toast notifications) would improve UX.

4. No loading state while fetching products.
   - Adding a loading state can enhance UX by providing feedback while data is being fetched.

5. `Number(updatedStock)` is calculated again when sending the request. This could be stored in a variable before calling `axios.patch()` to prevent redundancy.
*/
