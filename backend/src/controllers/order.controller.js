import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

import { Product } from "../models/product.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Invoice } from "../models/invoice.model.js";

import { sendEmail } from "../utils/sendEmail.js";

const createOrder = asyncHandler(async (req, res) => {
    // steps:
    // get order details from frontend
    // validation - not empty
    // check if order already exists: name
    // create order object - create entry in db
    // check for order creation
    // return res

    const { order_name, dept_id, dept_name, dept_admin_name, items_list } = req.body
    console.log("order_name: ", order_name);

    if (
        [order_name, dept_id, dept_name, dept_admin_name].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (!Array.isArray(items_list) || items_list.length === 0) {
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
        dept_name,
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

const getOrdersByDeptId = asyncHandler(async (req, res) => {
    // steps:
    // get order id from req.params
    // validation - not empty
    // check if order exists
    // return res

    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order id")
    }

    const order = await Order.find({ dept_id: id })

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

    const { id, items_list, store_manager_name, store_manager_approval } = req.body

    console.log("id", id);
    console.log("item_list: ", items_list);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid order id")
    }

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();

    try {
        // Start transaction
        session.startTransaction();

        const order = await Order.findById(id).session(session);
        if (!order) {
            throw new ApiError(404, "Order not found");
        }
        if (order.store_manager_approval !== null) {
            throw new ApiError(401, "Order already reviewed by store manager");
        }
        if (store_manager_approval === undefined) {
            throw new ApiError(400, "Store manager approval is required");
        }
        if (store_manager_approval === false) {
            order.register_approval = false;
        }

        order.store_manager_approval = store_manager_approval;
        order.store_manager_name = store_manager_name;

        if (store_manager_approval === false) {
            order.register_approval = false;
            await order.save({ session });
            // Commit transaction if everything succeeded
            await session.commitTransaction();

            // Send email notification
            const user = await User.findById(order.dept_id);
            if (!user) {
                throw new ApiError(404, "User not found");
            }
            if (!user.email) {
                throw new ApiError(400, "User email not found");
            }
            console.log(user.email);
            try {
                const emailSent = await sendEmail({
                    to: user.email,
                    subject: "Store Order Declined",
                    text: `Your order ${order.order_name} has been declined by the store manager. We are sorry for the inconvenience.`,
                    
                    
                });
                if (!emailSent) {
                    throw new ApiError(500, "Failed to send email notification");
                }
            } catch (error) {
                throw new ApiError(500, "Error sending email notification: " + error.message);
            }

            return res.status(200).json(new ApiResponse(200, "Order is declined", order));

        }


        // Process all items - validate and update `manager_alloted_quantity`
        for (const item of order.items_list) {
            const updatedItem = items_list.find((i) => i.id === item.id);
            if (updatedItem) {
                // Validate allotted quantity
                if (updatedItem.manager_alloted_quantity === undefined || updatedItem.manager_alloted_quantity < 0) {
                    throw new ApiError(403, `Invalid allotted quantity for item ${item.product_name}`);
                }
                if (updatedItem.manager_alloted_quantity > item.demand_quantity) {
                    throw new ApiError(403, `Allotted quantity exceeds demand for item ${item.product_name}`);
                }

                // Fetch the product details asynchronously
                const product = await Product.findOne({ name: item.product_name }).session(session);
                if (!product) {
                    throw new ApiError(404, `Product '${item.product_name}' not found`);
                }

                // Check if allotted quantity exceeds current stock
                if (updatedItem.manager_alloted_quantity > product.current_stock) {
                    throw new ApiError(403, `Allotted quantity exceeds stock for item ${item.product_name}`);
                }

                // Update the manager_alloted_quantity
                item.manager_alloted_quantity = Number(updatedItem.manager_alloted_quantity);
                item.manager_comment = updatedItem.manager_comment || "";
            }
        }

        // Save order updates
        await order.save({ session });

        // Commit transaction if everything succeeded
        await session.commitTransaction();

        return res
            .status(200)
            .json(new ApiResponse(200, "Store manager approval updated successfully", order));
    } catch (error) {
        // Abort transaction on any error
        await session.abortTransaction();
        throw error;
    } finally {
        // End session
        session.endSession();
    }
});

const regesterApproval = asyncHandler(async (req, res) => {
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

    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();

    try {
        // Start transaction
        session.startTransaction();


        order.register_approval = register_approval;
        order.register_name = register_name;

        if (register_approval === false) {
            await order.save({ session });
            await session.commitTransaction();

            // Send email notification
            // find user email to send email
            const user = await User.findById(order.dept_id);
            if (!user) {
                throw new ApiError(404, "User not found");
            }
            const emailSent = await sendEmail({
                to: user.email,
                subject: "Store product order Declined",
                text: `Your order ${order.order_name} has been declined. We are sorry for the inconvenience.`,
            });
            if (!emailSent) {
                throw new ApiError(500, "Failed to send email notification");
            }
            return res.status(200).json(new ApiResponse(200, "Order is declined", order));
        }

        // Process all items - validate everything first
        for (const item of order.items_list) {
            const updatedItem = items_list.find(i => i.id === item.id);
            if (updatedItem) {
                if (updatedItem.register_alloted_quantity === undefined || updatedItem.register_alloted_quantity < 0) {
                    throw new ApiError(400, `Invalid alloted quantity for item ${item.id}`);
                }
                
                if (updatedItem.manager_alloted_quantity > item.demand_quantity) {
                    throw new ApiError(403, `Allotted quantity exceeds demand for item ${item.product_name}`);
                }

                item.register_alloted_quantity = Number(updatedItem.register_alloted_quantity);

                // Fetch product and validate stock
                const product = await Product.findOne({ "name": item.product_name }).session(session);
                if (!product) {
                    throw new ApiError(404, `Product '${item.product_name}' not found`);
                }
                if (product.current_stock < item.register_alloted_quantity) {
                    throw new ApiError(400, `Insufficient stock for item '${item.product_name}'`);
                }
            }
        }

        // Now process all transactions and stock updates
        for (const item of order.items_list) {
            const updatedItem = items_list.find(i => i.id === item.id);
            if (updatedItem && item.register_alloted_quantity > 0) {
                const product = await Product.findOne({ "name": item.product_name }).session(session);

                // Create transaction
                const transaction = await Transaction.create([{
                    product_name: item.product_name,
                    product_id: item.id,
                    department: order.dept_name,
                    dept_id: order.dept_id,
                    order_id: order._id,
                    previous_stock: product.current_stock,
                    new_stock: product.current_stock - item.register_alloted_quantity,
                    change_stock: item.register_alloted_quantity,
                    transaction_type: "out"
                }], { session });

                if (!transaction || transaction.length === 0) {
                    throw new ApiError(400, "Transaction record creation failed");
                }

                // Update stock
                product.current_stock -= item.register_alloted_quantity;
                await product.save({ session, validateBeforeSave: false });
            }
        }

        // update invoice no in order
        const invoice = await Invoice.findOne({});
        if (!invoice) {
            const newInvoice = await Invoice.create({
                invoice_no: 1,
                order_id: order._id,
                
            });
            order.invoice_no = 1;
        } else {
            console.log("invoice: ", invoice);
            const newInvoiceNo = (invoice?.invoice_no + 1) || 1;

            // update new invoice no in invoice
            invoice.invoice_no = newInvoiceNo;
            invoice.order_id = order._id;
            await invoice.save({ session });
            order.invoice_no = newInvoiceNo;

        }

        // Save order updates
        await order.save({ session });

        // Commit transaction if everything succeeded
        await session.commitTransaction();

        // Send email notification
        // find user email to send email
        const user = await User.findById(order.dept_id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const emailSent = await sendEmail({
            to: user.email,
            subject: "Store Order Approved",
            text: `Your order ${order.order_name} has been approved. You can collect your alloted items.`,
        });
        if (!emailSent) {
            throw new ApiError(500, "Failed to send email notification");
        }

        return res.status(200).json(new ApiResponse(200, "Order is ready to deliver", order));
    } catch (error) {
        // Abort transaction on any error
        await session.abortTransaction();
        throw error;
    } finally {
        // End session
        session.endSession();
    }
});

export { createOrder, getOrders, getOrdersByDeptId, managerApproval, regesterApproval }