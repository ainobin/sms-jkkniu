import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

import { Product } from "../models/product.model.js";
import { Transaction } from "../models/transaction.model.js";

const createOrder = asyncHandler(async (req, res) => {
    // steps:
    // get order details from frontend
    // validation - not empty
    // check if order already exists: name
    // create order object - create entry in db
    // check for order creation
    // return res

    const {order_name, dept_id, dept_admin_name, items_list } = req.body
    // console.log("order_name: ", order_name);

    if( 
        [order_name, dept_id, dept_admin_name].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if(!Array.isArray(items_list) || items_list.length === 0) {
        throw new ApiError(400, "Items list can not be empty")
    }
    // console.log(items_list);
    
    const formattedItems = items_list.map((item, index) => {
        if (!item.product_name || item.demand_quantity === undefined) {
            throw new ApiError(400, `Invalid item at index ${index}: name and quantity are required`);
        }

        return {
            ...item,
            demand_quantity: Number(item.demand_quantity), // Convert to number
        };
    });
    
    const order = await Order.create({
        order_name,
        dept_id,
        dept_admin_name,
        items_list
    })
    if (!order) {
        throw new ApiError(400, "Order creation failed")
    }
    return res
    .status(201)
    .json(new ApiResponse(201, "Order created successfully", order))
})

const getOrders = asyncHandler(async (req, res) => {
    // steps:
    // get all orders from db
    // return res

    const orders = await Order.find({})
    return res
    .status(200)
    .json(new ApiResponse(200, "Orders fetched successfully", orders))
});

const getOrderById = asyncHandler(async (req, res) => {
    // steps:
    // get order id from req.params
    // validation - not empty
    // check if order exists
    // return res

    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order id")
    }

    const order = await Order.findById(id)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Order fetched successfully", order))
});

const managerApproval = asyncHandler(async (req, res) => {
    // steps:
    // get order details from req.body
    // validation - not empty, less then stock
    // check if order exists
    // update manager_alloted_quantity field
    // update store_manager_approval field
    // update store_manager_name field
    // return res;

    const {id, items_list, store_manager_name, store_manager_approval} = req.body

    // console.log("id", id);
    // console.log("item_list: ", items_list);
    
    

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order id")
    }
    

    const order = await Order.findById(id)
    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.store_manager_approval !== null) {
        throw new ApiError(400, "Order already Reviewed by store manager")
    }
    if (store_manager_approval === undefined) {
        throw new ApiError(400, "Store manager approval is required")
    }
    if(store_manager_approval == false){
        order.register_approval = false;
    }
    order.store_manager_approval = store_manager_approval;
    order.store_manager_name = store_manager_name;

    // ✅ Update only the `manager_alloted_quantity` for matching items
    order.items_list.forEach((item) => {
        const updatedItem = items_list.find(i => i.id === item.id);
        if (updatedItem) {
            if (updatedItem.manager_alloted_quantity === undefined || updatedItem.manager_alloted_quantity < 0) {
                throw new ApiError(400, `Invalid allotted quantity for item ${item.id}`);
            }
            item.manager_alloted_quantity = Number(updatedItem.manager_alloted_quantity);
        }
    });

    await order.save();

    return res
    .status(200)
    .json(new ApiResponse(200, "Store manager approval updated successfully", order))
});

const regesterApproval = asyncHandler(async (req, res) => {
    // steps:
    // get order id from req.body
    // validation - not empty
    // check if order exists
    // update register_approval field
    // update register_name field
    // create transaction for all products
    // call email api
    // call 
    // return res;

    const { id, items_list, register_name, register_approval } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order id");
    }

    if (register_approval === undefined) {
        throw new ApiError(400, "Register approval is required");
    }

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.register_approval !== null) {
        throw new ApiError(400, "Order already reviewed by register");
    }

    order.register_approval = register_approval;
    order.register_name = register_name;

    // Use for...of instead of forEach for async handling
    for (const item of order.items_list) {
        const updatedItem = items_list.find(i => i.id === item.id);
        if (updatedItem) {
            if (updatedItem.register_alloted_quantity === undefined || updatedItem.register_alloted_quantity < 0) {
                throw new ApiError(400, `Invalid allotted quantity for item ${item.id}`);
            }

            item.register_alloted_quantity = Number(updatedItem.register_alloted_quantity);

            // Fetch product correctly
            const product = await Product.findOne({ "name": item.product_name });
            if (!product) {
                throw new ApiError(404, `Product '${item.product_name}' not found`);
            }
            // create new transaction:
            const transaction = await Transaction.create({
                product_id : item.id,
                order_id : order._id,
                department : order.dept_id,
                previous_stock: product.current_stock,
                new_stock : product.current_stock - item.register_alloted_quantity,
                change_stock : item.register_alloted_quantity,
                transaction_type : "out"
            })

            if(!transaction){
                throw new ApiError(400, "transaction record failed");
            }

            // Update stock and save
            product.current_stock -= item.register_alloted_quantity;
            await product.save({ validateBeforeSave: false });
        }
    }
    await order.save();
    
    // Call email API (To be implemented)

    return res.status(200).json(new ApiResponse(200, "Order is ready to deliver", order));
});


export { createOrder, getOrders, getOrderById, managerApproval, regesterApproval}