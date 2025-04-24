import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "blob:", "res.cloudinary.com"],
                connectSrc: ["'self'", "https://store.jkkniu.edu.bd", "https://res.cloudinary.com"],
                scriptSrc: ["'self'"], // Remove 'unsafe-inline' and 'unsafe-eval'
                styleSrc: ["'self'"],
            }
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: { policy: "same-origin" },
        crossOriginResourcePolicy: { policy: "same-origin" },
        // Explicitly enable these headers that were missing
        frameguard: { action: "sameorigin" }, // X-Frame-Options
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        xContentTypeOptions: true, // X-Content-Type-Options
        hidePoweredBy: true,
        // Let Caddy handle HSTS
        hsts: false,
    })
);
// Set Permissions-Policy manually - wasn't being set properly
app.use((req, res, next) => {
    // Make sure this is properly passed through to client
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    next();
});


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