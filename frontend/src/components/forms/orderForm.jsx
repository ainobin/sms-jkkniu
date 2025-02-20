import { useState, useRef, useEffect } from "react";
import { FaTrash, FaPlus, FaPrint } from "react-icons/fa";
import { useForm, useFieldArray } from "react-hook-form";


function OrderForm() {

  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      orders: [
        {
          id: Date.now(),
          product: "",
          quantity: 0,
          available: true,
          comment: "",
        },
        {
          id: Date.now() + 1,
          product: "",
          quantity: 0,
          available: false,
          comment: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orders",
  });

  const onSubmit = (data) => {
    console.log("Order Data:", data.orders);  // Logging form data upon submission
  };

  const toggleAvailability = (index, value) => {
    setValue(`orders.${index}.available`, !value);  // Toggling availability status
  };

  const scrollRef = useRef(null);  // Creating a reference for scrolling
  const printRef = useRef();  // Creating a reference for printing

  useEffect(() => {
    // Automatically scroll to bottom when new order is added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [fields.length]);  // Triggering effect on changes to the order fields


  return(
    <div className="relative min-h-screen flex items-center justify-center p-6 pt-20 bg-cover bg-center">
      <div className="relative bg-white/40 backdrop-blur-md shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h3 className="text-center text-lg font-semibold mt-4">Order Form</h3>
        <p className="text-center text-gray-700">Dept Of CSE - 16-Jan-2025</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Print Area */}
          <div ref={printRef} className="print-area">
            <div className="grid grid-cols-5 gap-2 font-semibold text-center border-b pb-2 mt-4 bg-white/70 p-2 rounded-md">
              <span>Product</span>
              <span>Quantity</span>
              <span>Availability</span>
              <span>Comment</span>
              <span>Delete</span>
            </div>

            {/* Scrollable Order List */}
            <div
              ref={scrollRef}
              className="mt-2 space-y-4 max-h-60 overflow-y-auto"
            >
              {fields.map((order, index) => (
                <div
                  key={order.id}
                  className="grid grid-cols-5 gap-2 items-center border p-3 rounded-lg bg-white/60"
                >
                  {/* Product Selection */}
                  <select
                    {...register(`orders.${index}.product`)}
                    className="p-2 border rounded-lg"
                    aria-label="Select product"
                  >
                    <option value="">Select Product</option>
                    <option value="Pencil">Pencil</option>
                    <option value="Marker">Marker</option>
                  </select>

                  {/* Quantity Input */}
                  <input
                    type="number"
                    {...register(`orders.${index}.quantity`, { min: 1 })}
                    className="p-2 border rounded-lg text-center"
                    placeholder="Quantity"
                    min="1"
                    aria-label="Enter quantity"
                  />

                  {/* Availability Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleAvailability(index, order.available)}
                    className={`w-6 h-6 rounded-full border mx-auto flex items-center justify-center ${
                      watch(`orders.${index}.available`)
                        ? "bg-green-500 border-green-700"
                        : "bg-red-500 border-red-700"
                    }`}
                    aria-label="Toggle availability"
                  ></button>

                  {/* Comment Input */}
                  <input
                    type="text"
                    {...register(`orders.${index}.comment`)}
                    className="p-2 border rounded-lg"
                    placeholder="Comment"
                    aria-label="Enter comment"
                  />

                  {/* Remove Order Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove order"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            {/* Add Order Button */}
            <button
              type="button"
              onClick={() =>
                append({
                  id: Date.now(),
                  product: "",
                  quantity: 1,
                  available: false,
                  comment: "",
                })
              }
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
              aria-label="Add new order"
            >
              <FaPlus size={20} />
            </button>

            {/* Print Order Button */}
            <button
              type="button"
              onClick={() => generatePDF(watch("orders"))}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              aria-label="Print order form"
            >
              <FaPrint className="mr-2" />
              Print / Save PDF
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
              aria-label="Submit order form"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;