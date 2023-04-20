import mongoose, { Schema, model, Types } from "mongoose"

let brandSchema = new Schema({
    brandName: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    brandImage: {
        type: Object,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true // will convert after user model
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

export let brandModel = mongoose.models.Brand || model("Brand", brandSchema)
