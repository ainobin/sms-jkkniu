import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";

const getTransactions = asyncHandler(async (req, res) => {
    // steps:
    // get prodcut id feom url, params,
    // find all transaction with that product_id,

    const { product_id } = req.params; // Extract product_id from request parameters

    // console.log(`test : ${product_id}`);
    

    // Query transactions by product_id
    const transactions = await Transaction.find({ product_id });
    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
        return res
            .status(403)
            .json(new ApiResponse(403, "No transactions found for this product"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Transactions fetched successfully", transactions));
});

const getTransactionsByDept = asyncHandler(async (req, res) => {
    // steps:
    // get dept name from url, params,
    // find all transaction with that dept_name,

    const { dept_id } = req.params; // Extract product_id from request parameters

    // console.log(dept_id);
    // Query transactions by dept_name
    const transactions = await Transaction.find({ dept_id });
    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
        return res
            .status(403)
            .json(new ApiResponse(403, "No transactions found for this department"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Transactions fetched successfully", transactions));
});
export {getTransactions, getTransactionsByDept}