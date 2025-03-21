import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN.split(','), // Convert comma-separated string to an array
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
}));
app.use(express.json({
    limit: '16kb'

}));
app.use(express.urlencoded({
    extended:true,
    limit: '16kb'
}));
app.use(express.static('public'));
app.use(cookieParser());


// routes
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

// route calls
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/transactions", transactionRoutes)
 
export {app}