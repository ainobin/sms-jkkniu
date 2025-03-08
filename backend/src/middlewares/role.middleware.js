import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "./verifyJWT.js";
import {ApiError} from "../utils/ApiError.js"; 

// Middleware to check if the user is a department admin
export const isDeptAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "deptAdmin") {
        throw new ApiError(403, "Access denied: Requires Department Admin privileges");
    }
    next();
});

// Middleware to check if the user is a store manager
export const isStoreManager = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "storeManager") {
        throw new ApiError(403, "Access denied: Requires Store Manager privileges");
    }
    next();
});

// Middleware to check if the user is a registrar
export const isRegistrar = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "registrar") {
        throw new ApiError(403, "Access denied: Requires Registrar privileges");
    }
    next();
});
