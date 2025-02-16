import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true 
        },
        fullName: { 
            type: String, 
            required: true, 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        designation: { 
            type: String, 
            required: true
        },
        role: { 
            type: String, 
            enum: ["register", "manager", "deptAdmin"], 
            required: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        signatureURL: { 
            type: String, // coudianry url
            required: true
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = bcrypt.hash(this.password, 11);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken =  function (){
    return jwt.sign({
            _id: this._id,
            fullName: this.fullName,
            email: this.email,
            role: this.role  
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        }
    )
}

module.exports = mongoose.model("User", userSchema);
