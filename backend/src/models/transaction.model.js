import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema(
    {
        product_id: {
            type: String,
            require: true,

        },
        order_id: {
            type: String,
            require: true,
        },
        department:{
            type: String,
            require: true,
        },
        previous_stock:{
            type: Number,
            require: true,
        },
        new_stock: {
            type: Number,
            require: true,
        },
        change_stock:{
            type: Number,
            require: true,
        },
        transaction_type:{
            type: String,
            enum: ["in","out"],
            require:true,
        }
    },
    {
        timestamps: true
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);