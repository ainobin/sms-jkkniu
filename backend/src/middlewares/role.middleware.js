import { asyncHandler } from "../utils/asyncHandler.js";
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
    if (req.user.role !== "manager") {
        throw new ApiError(403, "Access denied: Requires Store Manager privileges");
    }
    next();
});

// Middleware to check if the user is a registrar
export const isRegister = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "register") {
        throw new ApiError(403, "Access denied: Requires Register privileges");
    }
    next();
});

// Middleware to check if the user is a manager/registrar
export const isManagerOrRegistrar = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "manager" && req.user.role !== "register") {
        throw new ApiError(403, "Access denied: Requires Manager or Registrar privileges");
    }
    next();
});
