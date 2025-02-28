import mongoose from "mongoose";

// schema for each item in the order
const ItemSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true
    },
    product_name: { 
        type: String, 
        required: true 
    },
    demand_quantity: { 
        type: Number, 
        required: true
    },
    manager_alloted_quantity: { 
        type: Number, 
        default: 0 
    }, // Default 0 if not allocated

    comment: { 
        type: String, 
        default: '' 
    }
});

const OrderSchema = new mongoose.Schema({
    order_name: { 
        type: String,
        required: true 
    },
    dept_id: { 
        type: String, 
        required: true 
    },
    dept_admin_name: { 
        type: String, 
        required: true 
    },
    items_list: { 
        type: [ItemSchema], 
        required: true 
    }, // Array of items
    store_manager_approval: { 
        type: Boolean, 
        default: null 
    },
    store_manager_name: { 
        type: String, 
        default: '' 
    },
    register_approval: { 
        type: Boolean, 
        default: null 
    },
    register_name: { 
        type: String, 
        default: '' 
    },
    invoice_no: { 
        type: String, 
        unique: true, 
        sparse: true 
    } // Can be empty initially
}, { timestamps: true });

export const Order = mongoose.model('Order', OrderSchema);
