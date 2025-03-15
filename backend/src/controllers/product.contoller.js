import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";

const createProduct = asyncHandler(async (req, res) => {
    // steps:
    // get product details from frontend
    // validation - not empty
    // check if product already exists: name
    // create product object - create entry in db
    // check for product creation
    // return res

    const {name, category, threshold_point, current_stock } = req.body
    // console.log("name: ", name);

    if( 
        [name, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if(current_stock < 0) {
        throw new ApiError(400, "Current stock can not be negative")
    }
    if(threshold_point < 0) {
        throw new ApiError(400, "Threshold point can not be negative")
    }

    const existedProduct = await Product.findOne({
        name
    });
    if (existedProduct) {
        throw new ApiError(409, "Product already exists")
    }

    const product = await Product.create({
        name,
        category,
        threshold_point,
        current_stock
    });

    if (!product) {
        throw new ApiError(400, "Product creation failed")
    }

    const transaction = await Transaction.create({
        product_id : product._id,
        order_id : null,
        department : null,
        previous_stock: 0,
        new_stock : current_stock,
        change_stock : current_stock,
        transaction_type : "in",
    })
    if(!transaction){
        throw new ApiError(400, "transaction record failed");
    }

    return res.json(new ApiResponse(200, "Product created successfully", product))
    
});

const getAllProducts = asyncHandler(async (req, res) => {
    // steps:
    // get all products from db
    // return res

    const products = await Product.find({});
    return res.json(new ApiResponse(200, "All products", products));

});

const getProduct = asyncHandler(async (req, res) => {
    // stpes:
    // get product id or name from frontend
    // check if product exists
    // return res

    const {id, name} = req.body;
    // console.log("id: ", id);
    // console.log("name: ", name);

    if (!id && !name) {
        throw new ApiError(400, "Id or name is required")
    }
    let product;
    if (id) {
        product = await Product.findById(id);
    }
    if (name) {
        product = await Product.findOne({name});
    }
    if (!product) {
        throw new ApiError(404, "Product not found")
    }
    return res.json(new ApiResponse(200, "Product found", product));
});

const stockUpdate = asyncHandler(async (req, res) => {
    // steps:
    // get products name from frontend
    // check if products exists
    // update stock level
    // return res

    const {name, stock} = req.body;
    // console.log("name: ", name);

    if (!name || !stock) {
        throw new ApiError(400, "Name and stock are required")
    }

    if (stock < 0) {
        throw new ApiError(400, "Stock can not be negative")
    }

    const product = await Product.findOne({"name": name});
    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    const transaction = await Transaction.create({
        product_id : product._id,
        order_id : null,
        department : null,
        previous_stock: product.current_stock,
        new_stock : stock,
        change_stock : stock - product.current_stock,
        transaction_type : "in",
    })
    if(!transaction){
        throw new ApiError(400, "transaction record failed");
    }

    product.current_stock = stock;
    await product.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, "Stock updated successfully", product));
});


export { createProduct, getAllProducts, getProduct, stockUpdate };

