import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            unique: true 
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

module.exports = mongoose.model("Product", productSchema);