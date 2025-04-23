import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
// Load environment variables from .env file
dotenv.config();

const app = express();

// Add Helmet early in middleware chain for security headers
app.use(
    helmet({
        contentSecurityPolicy: false, // since Caddy handles it
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: { policy: "same-origin" },
        crossOriginResourcePolicy: { policy: "same-origin" },
        frameguard: { action: "sameorigin" },
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        xssFilter: true,
        hidePoweredBy: true,
    })
);


app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*', // Add fallback if undefined
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
}));
app.use(express.json({
    limit: '16kb'

}));
app.use(express.urlencoded({
    extended: true,
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


export { app }