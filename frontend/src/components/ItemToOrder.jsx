import React from 'react'
import { useState } from "react";

export default function ItemRow() {
    const [quantity, setQuantity] = useState(0);
    const [color, setColor] = useState("#3F9A0D");
    const [comment, setComment] = useState("comment");
    const [selectedItem, setSelectedItem] = useState("Pencil");
  
    const handleDelete = () => {
      console.log("Item deleted");
    };
  
    return (
        <div className="flex flex-wrap items-center border border-green-600 rounded-lg p-2 gap-4 w-full max-w-4xl">
        {/* Dropdown */}
        <select
          className="border bg-white p-2 text-black flex-2 min-w-[100px]"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option>Pencil</option>
          <option>Pen</option>
          <option>Notebook</option>
        </select>
  
        {/* Quantity */}
        <input
          type="number"
          className="border p-2 text-center flex-1 min-w-[50px]"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
  
        {/* Color Picker */}
        <input
          type="color"
          className="w-8 h-8 border flex-shrink-0"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
  
        {/* Comment */}
        <input
          type="text"
          className="border p-2 flex-1 min-w-[150px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
  
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="border border-red-500 text-red-500 px-3 py-2 flex-shrink-0 hover:bg-red-100 rounded"
        >
          ✖
        </button>
      </div>
    );
  }