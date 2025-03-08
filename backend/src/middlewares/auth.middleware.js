import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"; 

export const verifyJWT = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("token: ",token);

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password");
    
        if(!user){
            throw new ApiError(401, "Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized");
    }

})