import mongoose, { Schema, model, Types } from "mongoose"

let couponSchema = new Schema({
    couponName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    expireDate:{
        type:Date,
        required:true,
    }
    ,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    couponImage: {
        type: Object,
    },
    usedBy: [{ type: Types.ObjectId, ref: "User" }],   // will convert after user model 
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: false // will convert after user model
    }
}, { timestamps: true })

export let couponModel = mongoose.models.Coupon || model("Coupon", couponSchema)


