import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

const Restock = () => {
  const { control, handleSubmit, setValue, watch } = useForm();
  const [products, setProducts] = useState([]);
  const [currentQuantity, setCurrentQuantity] = useState(0);

  // Fetch all products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products/getAllProducts");
        setProducts(response.data.message);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Watch selected product
  const selectedProduct = watch("selectedProduct");

  useEffect(() => {
    if (selectedProduct) {
      setCurrentQuantity(selectedProduct.current_stock);
    }
  }, [selectedProduct]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!data.selectedProduct || data.restockQuantity < 1) {
      alert("Please select a product and enter a valid restock quantity.");
      return;
    }

    const updatedStock = Number(currentQuantity) + Number(data.restockQuantity);

    try {
      const response = await axios.patch("http://localhost:3000/api/v1/products/stockUpdate", {
        name: data.selectedProduct.label,
        stock: Number(updatedStock),
      });

      if (response.status === 200) {
        alert("Stock successfully updated!");
        setValue("restockQuantity", "");
        setCurrentQuantity(updatedStock);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Restock Inventory</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Product Selection */}
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
                    current_stock: product.current_stock,
                  }))}
                  className="w-full"
                  placeholder="Select a product"
                  isSearchable
                />
              )}
            />
          </div>

          {/* Current Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Current Quantity</label>
            <input
              type="number"
              value={currentQuantity}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          {/* Restock Quantity */}
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
