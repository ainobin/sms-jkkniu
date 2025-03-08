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

    console.log(product_id);
    

    // Query transactions by product_id
    const transactions = await Transaction.find({ product_id });

    return res
        .status(200)
        .json(new ApiResponse(200, "Transactions fetched successfully", transactions));
});

export {getTransactions}