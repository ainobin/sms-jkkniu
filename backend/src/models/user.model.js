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
        depertment: { 
            type: String, 
            required: true
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
        signature: { 
            type: String, // coudianry url
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// this is a pre hook that will run before the save method
// this will hash the password before saving it to the database
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 11);
    next();
})

// this is a method that will be available on the user model
// this method will be used to compare the password entered by the user
// with the password stored in the database
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}


// this is a method that will be available on the user model
// this method will be used to generate an access token for logged in users
// the access token will be used to authenticate the user and give them access to protected routes
userSchema.methods.generateAccessToken =  function (){
    return jwt.sign({
            _id: this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email,
            role: this.role,
            depertment: this.depertment,
            designation: this.designation,
            signature: this.signature  
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        }
    )
}

export const User = mongoose.model("User", userSchema)
