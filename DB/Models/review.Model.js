import mongoose, { Schema, Types, model } from "mongoose"

let reviewSchema = new Schema({

    reviewDesc: { type: String, required: true },
    rate: { type: Number, min: 1, max: 5, default: 1 },
    orderId: { type: Types.ObjectId, ref: "Order", required: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    isDeleted: {type: Boolean, default: false}

}, { timestamps: true })


export let reviewModel = mongoose.models.Review || model("Review", reviewSchema) 