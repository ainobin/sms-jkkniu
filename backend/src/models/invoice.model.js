import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoice_no: {
            type: Number,
            require: true,
        },
        order_id: {
            type: String,
            require: true,
        }
    },
    {
        timestamps: true
    }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);