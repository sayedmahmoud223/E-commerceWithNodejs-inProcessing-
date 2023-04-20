import mongoose, { Schema, model } from "mongoose"

let userSchema = Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    phoneNumber: {
        type: String,
    },
    forgetPassword: {
        type: String,
        default: undefined
    },
    confirmEmail: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    role: {
        type: String,
        default: "User",
    },
    status: {
        type: String,
        default: "Offline",
        enum: ["Offline", "Online", "Blocked"]
    },

}, { timestamps: true })


export let userModel = mongoose.models.User || model("User", userSchema) 