import mongoose, { Schema, Types, model } from "mongoose"

let orderSchema = new Schema({

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User"},
    products: [{
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        productName: { type: String},
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true },
    }],
    finalPrice: { type: Number, default: 1, required: true },
    coupon: { type: Types.ObjectId, ref: "Coupon" },
    note: String,
    reason: String,
    address: { type: String, required: true },
    phone: { type: [String], required: true },
    status: { type: String, default: "waitToPayment", enum:["placed","waitToPayment","rejected","onWay","delivered", "canceled"] },
    paymentType: { type: String, default: "cash", enum:["cash","card"] },
    
    isDeleted: { type: Boolean, default: false },


}, { timestamps: true })


export let orderModel = mongoose.models.Order || model("Order", orderSchema) 