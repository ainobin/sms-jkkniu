import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes  } from "react-icons/fa";
import { MdDelete } from "react-icons/md"

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: "", quantity: 1, availability: false, comment: "" },
  ]);

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

  const handleProductChange = (index, productName) => {
    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index].name = productName;

    const product = products.find((p) => p.name === productName);
    updatedOrderItems[index].availability = product ? product.current_stock > 0 : false;

    setOrderItems(updatedOrderItems);
    setSelectedProducts([...selectedProducts, productName]);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index].quantity = quantity;

    const product = products.find((p) => p.name === updatedOrderItems[index].name);
    updatedOrderItems[index].availability = product ? quantity <= product.current_stock : false;

    setOrderItems(updatedOrderItems);
  };

  const handleCommentChange = (index, comment) => {
    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index].comment = comment;
    setOrderItems(updatedOrderItems);
  };

  const addRow = () => {
    setOrderItems([...orderItems, { id: Date.now(), name: "", quantity: 1, availability: false, comment: "" }]);
  };

  const removeRow = (index) => {
    const removedItem = orderItems[index].name;
    const updatedItems = orderItems.filter((_, i) => i !== index);

    setOrderItems(updatedItems);
    setSelectedProducts(selectedProducts.filter((item) => item !== removedItem));
  };

  const handleSubmit = () => {
    const orderData = orderItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      comment: item.comment,
    }));

    console.log("Order JSON:", JSON.stringify(orderData, null, 2));
  };

  return (
    <div className="max-w-4xl text-center mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">📦 Place an Order</h2>

      {/* Table Headings */}
      <div className="hidden md:grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-md font-semibold text-gray-700 text-sm">
        <span>Product Name</span>
        <span>Quantity</span>
        <span>Availability</span>
        <span>Comment</span>
        <span>Action</span>
      </div>

      {/* Order Table */}
      <div className="space-y-3 mt-2">
        {orderItems.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
          >
            {/* Product Name */}
            <select
              value={item.name}
              onChange={(e) => handleProductChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>
              {products
                .filter((product) => !selectedProducts.includes(product.name) || product.name === item.name)
                .map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
            </select>

            {/* Quantity */}
            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
              className="w-full p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Availability Indicator */}
            <div className="flex justify-center">
              <div
                className={`w-3 h-3 ${item.availability ? "bg-green-500" : "bg-red-500"} shadow-md`}
                title={item.availability ? "Available" : "Not Available"}
              ></div>
            </div>

            {/* Comment */}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <input
                type="text"
                value={item.comment}
                onChange={(e) => handleCommentChange(index, e.target.value)}
                placeholder="Optional note..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center">
              {/* Remove Button */}
              {orderItems.length > 1 && (
                <button onClick={() => removeRow(index)} className="text-red-500 hover:text-red-700">
                  {/* <FaTimes size={18} /> */}
                  <MdDelete/> 
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col md:flex-row justify-between mt-5 gap-2">
        {/* Add Row Button */}
        <button
          onClick={addRow}
          className="w-full md:w-auto px-4 py-2 text-sm bg-blue-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-blue-600 transition"
        >
          <FaPlus size={14} /> Add Item
        </button>

        {/* Submit Order Button */}
        <button
          onClick={handleSubmit}
          className="w-full md:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Submit Order
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
