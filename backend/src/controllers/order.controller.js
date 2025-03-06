import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
    // steps:
    // get order details from frontend
    // validation - not empty
    // check if order already exists: name
    // create order object - create entry in db
    // check for order creation
    // return res

    const {order_name, dept_id, dept_admin_name, items_list } = req.body
    console.log("order_name: ", order_name);

    if( 
        [order_name, dept_id, dept_admin_name].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if(!Array.isArray(items_list) || items_list.length === 0) {
        throw new ApiError(400, "Items list can not be empty")
    }
    console.log(items_list);
    
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

    const {_id, items_list, store_manager_name, store_manager_approval} = req.body
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        throw new ApiError(400, "Invalid order id")
    }

    const order = await Order.findById(_id)
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
    // call transaction api
    // call email api
    // call 
    // return res;

    const { _id, items_list, register_name, register_approval } = req.body
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        throw new ApiError(400, "Invalid order id")
    }

    if (register_approval === undefined) {
        throw new ApiError(400, "Register approval is required")
    }

    const order = await Order.findById(_id)

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.register_approval !== null) {
        throw new ApiError(400, "Order already Reviewed by register")
    }

    order.register_approval = register_approval;
    order.register_name = register_name;

    order.items_list.forEach((item) => {
        const updatedItem = items_list.find(i => i.id === item.id);
        if(updatedItem) {
            if(updatedItem.register_alloted_quantity === undefined || updatedItem.register_alloted_quantity<0){
                throw new ApiError(400, `Invalid allotted quantity for item ${item.id}`)
            }
            item.register_alloted_quantity = Number(updatedItem.register_alloted_quantity);
        }
    })

    await order.save();

    // call transaction api
    
    // call email api

    return res
    .status(200)
    .json(new ApiResponse(200, "Order is ready to deliver", order));
});


export { createOrder, getOrders, getOrderById, managerApproval, regesterApproval}