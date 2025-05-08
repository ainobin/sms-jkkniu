import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


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


    const { username, fullName, email, department, designation, role, password, signatureURL } = req.body
    
    console.log("Register User FullName: ", fullName);

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

    // Get signature URL if file is provided, otherwise set to empty string
    let secureSignatureUrl = "";
    const signatureFile = req.files?.signature?.[0];
    
    if (signatureFile) {
        const signature = await uploadBufferToCloudinary(signatureFile.buffer, "signatures")
        if (!signature) {
            throw new ApiError(400, "Error uploading signature file")
        }

        // Ensure the URL uses HTTPS instead of HTTP
        secureSignatureUrl = signature.url.replace("http://", "https://");
    }

    const user = await User.create({
        username,
        fullName,
        email,
        department,
        designation,
        role,
        password,
        signature: secureSignatureUrl
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
    console.log("login username: ", username);
    // console.log("password: ", password);

    if (!username || !password) {
        throw new ApiError(400, "username and password are required");
    }

    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }

    const loggedInUser = await User.findById(user._id).select("-password");

    const accessToken = await loggedInUser.generateAccessToken();

    // console.log(accessToken);

    // https only
    return res
    .status(200)
    .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",  // Strongest protection against CSRF
        secure: true,        // Only send cookies over HTTPS
        maxAge: 3600000,     // 1 hour expiry
        path: "/",           // Cookie available across your entire domain
        domain: "store.jkkniu.edu.bd" // Explicitly set your domain
    })
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully")); // no need to send access token in response body
    
    // return res
    //     .status(200)
    //     .cookie("accessToken", accessToken, {
    //         httpOnly: true,
    //         sameSite: "lax",  // Works with HTTP
    //         secure: false,    // Allow cookies over HTTP
    //         maxAge: 3600000,
    //     })
    //     .json(new ApiResponse(200, loggedInUser, "User logged in successfully", accessToken));
});

const logoutUser = asyncHandler(async (req, res) => {
    // steps:
    // clear the access token cookie
    // return res

    return res
    .status(200)
    .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        domain: "store.jkkniu.edu.bd"
    })
    .json(new ApiResponse(200, {}, "User logged out successfully"));
    //for https connections
    // return res
    //     .status(200)
    //     .clearCookie("accessToken", {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production" || true, // Set secure to true if the site is being served over HTTPS (production)
    //         sameSite: "none" // Set sameSite to 'none' if the site is being served over HTTPS (production)
    //     })
    //     .json(new ApiResponse(200, {}, "User logged out successfully"));

    // for http connections
    

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
    await user.save({ validateBeforeSave: false });

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
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        { new: true }

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

    // First get the current user to find their existing signature
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    // Check if file is provided
    const signatureFile = req.file;
    if (!signatureFile) {
        throw new ApiError(400, "Signature file is required");
    }

    // Upload new signature
    const signature = await uploadBufferToCloudinary(signatureFile.buffer, "signatures");
    if (!signature.url) {
        throw new ApiError(400, "Error uploading signature");
    }
    
    // Ensure the URL uses HTTPS instead of HTTP
    const secureSignatureUrl = signature.url.replace("http://", "https://");

    // Extract public_id from the existing signature URL if it exists
    if (currentUser.signature) {
        try {
            // Extract the public ID from the Cloudinary URL
            // URL format: https://res.cloudinary.com/dmbssx3sj/image/upload/v1745120666/signatures/etk2hrkyaejfjmxmscrr.png
            const urlParts = currentUser.signature.split('/');

            // Get the last two segments (folder/filename)
            const filename = urlParts[urlParts.length - 1].split('.')[0]; // etk2hrkyaejfjmxmscrr
            const folder = urlParts[urlParts.length - 2];                 // signatures
            const publicId = `${folder}/${filename}`;                     // signatures/etk2hrkyaejfjmxmscrr
                        // Delete old signature
            await deleteFromCloudinary(publicId);
        } catch (error) {
            console.error("Error deleting previous signature:", error);
            // Continue with update even if deletion fails
        }
    }


    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                signature: secureSignatureUrl
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

const getRegisterSignature = asyncHandler(async (req, res) => {
    // steps:
    // get register user data
    // return res

    const user = await User.find({ role: "register" }).select("-password");
    if (!user) {
        throw new ApiError(404, "Register users not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user[0]?.signature, "Register users found successfully"));
});

const getManagerSignature = asyncHandler(async (req, res) => {
    // steps:
    // get manager user data
    // return res

    const user = await User.find({ role: "manager" }).select("-password");
    return res
        .status(200)
        .json(new ApiResponse(200, user[0]?.signature, "Manager users found successfully"));
});

const getDeptAdminSignature = asyncHandler(async (req, res) => {
    // steps:
    // get deptAdmin id from params
    // find deptAdmin from db by id
    // return res
    const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new ApiError(404, "Department Admin not found");
    }
        return res
        .status(200)
        .json(new ApiResponse(200, user.signature, "Dept Admin found successfully"));
});

// get all department's only name with role deptAdmin
const getAllDept = asyncHandler(async (req, res) => {
    const users = await User.find({ role: "deptAdmin" }).select("department _id");
    if (!users) {
        throw new ApiError(404, "Department Admins not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Department Admins found successfully"));
});



export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    changeDetails,
    getCurrentUser,
    changeSignature,
    getRegisterSignature,
    getManagerSignature,
    getDeptAdminSignature,
    getAllDept

}