import { useState, useEffect } from "react";
import axios from "axios";

const Restock = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [restockQuantity, setRestockQuantity] = useState("");

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

  // Update current quantity when a product is selected
  const handleProductChange = (event) => {
    const productName = event.target.value;
    setSelectedProduct(productName);

    // Find the selected product in the product list
    const product = products.find((p) => p.name === productName);
    setCurrentQuantity(product ? product.current_stock : 0);
  };

  // Validate restock quantity (must be >= 1)
  const handleRestockChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setRestockQuantity(value >= 1 ? value : "");
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct || restockQuantity < 1) {
      alert("Please select a product and enter a valid restock quantity.");
      return;
    }

    const updatedStock = currentQuantity + restockQuantity;

    try {
      const response = await axios.patch("http://localhost:3000/api/v1/products/restock", {
        name: selectedProduct,
        stock: updatedStock,
      });

      if (response.status === 200) {
        alert("Stock successfully updated!");
        setRestockQuantity("");
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
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Restock Inventory</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Product Name</label>
            <select
              value={selectedProduct}
              onChange={handleProductChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
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
            <input
              type="number"
              value={restockQuantity}
              onChange={handleRestockChange}
              min="1"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
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
