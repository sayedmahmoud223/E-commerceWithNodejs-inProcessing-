import mongoose, { Schema, Types, model } from "mongoose"

let orderSchema = new Schema({

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    products: [{
        productId: { type: Types.ObjectId, ref: "Product", requiredS: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true },
    }],
    finalPrice: { type: Number, default: 1, required: true },
    coupon: { type: Types.ObjectId, ref: "Coupon" },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "placed", enum:["placed","waitToPayment","rejected","onWay","delivered"] },
    paymentType: { type: String, default: "cash", enum:["cash","card"] },
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true })


export let orderModel = mongoose.models.Order || model("Order", orderSchema) 