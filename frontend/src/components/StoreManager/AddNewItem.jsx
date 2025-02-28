import React from 'react'
import { useState } from "react";
import axios from "axios";

const AddNewItem = () => {
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    threshold_point: "",
    current_stock: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("add: ",JSON.stringify(formData))
      const response = await axios.post(
        "http://localhost:3000/api/v1/products/createProduct", 
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );      
      setAlert({ type: "success", message: "Item added successfully!" });
      // Reset form fields
      
    } catch (error) {
      console.error("Error adding item:", error);
      setAlert({ type: "error", message: "Failed to add item. Try again." });
    } finally{
      setFormData({
        name: "",
        category: "",
        threshold_point: "",
        current_stock: "",
      });
      setTimeout(() => setAlert(null), 4000);
    }
  };


  return (
    <div className="flex mt-7 justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Add New Item</h2>
        
        {alert && (
          <div className={`p-3 mb-4 text-white rounded ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="Print">Print</option>
              <option value="Stationary">Stationary</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Threshold Point</label>
            <input
              type="number"
              name="threshold_point"
              value={formData.threshold_point}
              onChange={handleChange}
              placeholder="Enter threshold point"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Stock</label>
            <input
              type="number"
              name="current_stock"
              value={formData.current_stock}
              onChange={handleChange}
              placeholder="Enter current stock"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddNewItem