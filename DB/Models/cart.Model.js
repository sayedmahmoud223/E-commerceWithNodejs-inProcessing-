import mongoose, { Schema, Types, model } from "mongoose"

let cartSchema = new Schema({

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    products: [{
        productId: { type: Types.ObjectId, ref: "Product",required:true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true })


export let cartModel = mongoose.models.cart || model("cart", cartSchema) 