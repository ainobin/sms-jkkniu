import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },
        catagory: {
            type: String, 
            required: true 
        },
        threshold_point: { 
            type: Number, 
            required: true 
        },
        current_stock: { 
            type: Number, 
            required: true 
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);