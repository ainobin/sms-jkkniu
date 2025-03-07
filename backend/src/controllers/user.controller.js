import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; 
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import {User} from "../models/user.model.js";


const registerUser = asyncHandler(async (req, res) => {
    // steps:
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email, depertment
    // check for images, signature
    // upload them to cloudinary, siganture
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {username, fullName, email, department, designation, role, password, signatureURL } = req.body
    // console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }, { department }]
    })
    if (existedUser) {
        throw new ApiError(409, "email or username or depertment already exists")
    }
    
    const signatureLocalPath = req.files?.signature[0]?.path;

    if (!signatureLocalPath) {
        throw new ApiError(400, "Signature file is required")
    }

    const signature = await uploadOnCloudinary(signatureLocalPath)
    if (!signature) {
        throw new ApiError(400, "Signature file is required")
    }

    const user = await User.create({
        username,
        fullName,
        email,
        department,
        designation,
        role,
        password,
        signature: signature.url
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

});

const loginUser = asyncHandler(async (req, res) => {
    // steps:
    // req body - username, password
    // find user by username
    // check password
    // generate access token
    // send secure cookie with access token
    // return res

    const { username, password } = req.body;
    // console.log("username: ", username);
    // console.log("password: ", password);

    if (!username || !password) {
        throw new ApiError(400, "username and password are required");
    }

    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    const loggedInUser = await User.findById(user._id).select("-password");

    const accessToken = await loggedInUser.generateAccessToken();
    // console.log(accessToken);
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",  // Helps prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,  // Optional: Set cookie expiry (e.g., 1 hour)
        })
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully", accessToken));
});

const logoutUser = asyncHandler(async (req, res) => {
    // steps:
    // clear the access token cookie
    // return res

    return res
    .status(200)
    .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
    .json( new ApiResponse(200, {}, "User logged out successfully"));

});

const changePassword = asyncHandler(async (req, res) => {
    // steps:
    // req body - old password, new password
    // find user by id
    // check old password
    // update password
    // return res

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "old password and new password are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const changeDetails = asyncHandler(async (req, res) => {
    // steps:
    // req body - email, depertment, designation
    // find user by id
    // update user details
    // return res
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName : fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const changeSignature = asyncHandler(async (req, res) => {
    // steps:
    // req body - signature
    // find user by id
    // check for signature
    // upload signature to cloudinary
    // update user signature
    // return res

    const signatureLocalPath = req.file?.path;

    if (!signatureLocalPath) {
        throw new ApiError(400, "Signature file is required");
    }

    const signature = await uploadOnCloudinary(signatureLocalPath);

    if (!signature.url) {
        throw new ApiError(400, "Error uploading signature");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { 
            $set: { 
                signature: signature.url 
            } 
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Signature changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User found successfully"));
});



export { 
    registerUser, 
    loginUser,
    logoutUser,
    changePassword,
    changeDetails,
    getCurrentUser,
    changeSignature,
}