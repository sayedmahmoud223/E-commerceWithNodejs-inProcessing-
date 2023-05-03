import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { productModel } from "../../../../DB/Models/product.Model.js"
import { cartModel } from "../../../../DB/Models/cart.Model.js";
import { couponModel } from "../../../../DB/Models/coupon.Model.js";
import { orderModel } from "../../../../DB/Models/order.Model.js";
import { createInvoice } from "../../../utils/pdf.js";
import Stripe from "stripe";
import { stripePayment } from "../../../utils/payment.js";




export let createOrder = async (req, res, next) => {
    let { address, phone, couponName, note, paymentType } = req.body;
    if (couponName) {
        let coupon = await couponModel.findOne({ couponName, usedBy: { $nin: req.user._id } });
        if (!coupon || (Date.now() > coupon.expireDate.getTime())) {
            return next(new ResError(`in-valid coupon`, 400))
        }
        req.body.coupon = coupon
    }
    if (!req.body.products) {
        let cart = await cartModel.findOne({ createdBy: req.user._id })
        if (!cart?.products.length) {
            return next(new ResError(`embty cart`, 400))
        }
        req.body.products = cart.products
    }
    let finalOrderProductList = [];
    let productIds = [];
    let sumTotal = 0;
    for (let i = 0; i < req.body.products.length; i++) {
        let product = req.body.products[i];
        let eachProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false,
        })
        if (!eachProduct) {
            let findProductName = await productModel.findById({ _id: product.productId })
            return findProductName ? next(new ResError(`invalid products can added to cart ${findProductName.productName} `, 400)) :
                next(new ResError(`invalid product Id`, 400))
        }
        // product = product.toJson()
        product.productName = eachProduct.productName
        product.unitPrice = eachProduct.finalPrice;
        product.finalPrice = product.unitPrice * product.quantity;
        productIds.push(product.productId)
        finalOrderProductList.push(product)
        sumTotal += product.finalPrice;
    }
    let order = await orderModel.create({
        createdBy: req.user._id,
        products: finalOrderProductList,
        coupon: req.body.coupon?._id,
        finalPrice: sumTotal - (((req.body.coupon?.amount || 0) / 100) * sumTotal),
        address,
        phone,
        note,
        paymentType,
        status: paymentType == "card" ? "waitToPayment" : "placed"
    })
    if (!order) {
        return next(new ResError(`your order don't completed`, 400));
    }
    for (let product of req.body.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -(product.quantity) } })
    }
    if (!req.body.products) {
        await cartModel.updateOne({ createdBy: req.user._id }, { products: [] })
    }
    // await couponModel.findOneAndUpdate({ couponName }, { $addToSet: { usedBy: req.user._id } })
    await cartModel.updateOne({ createdBy: req.user._id }, { $pull: { products: { productId: { $in: productIds } } } })

    //pdf
    let invoice = {
        shipping: {
            name: req.user.userName,
            address: req.user.email,
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: req.user._id
        },
        items: order.products,
        sumTotal: sumTotal,
        discount: req.body.coupon?.amount,
        finalPrice: order.finalPrice,
        invoice_nr: order._id,
        date: order.createdAt,


    };
    createInvoice(invoice, "invoice.pdf");

    // stripe payment
    if (paymentType == "card") {
        const stripe = new Stripe(process.env.PAYMENT_SECRET_KET)
        if (req.body.coupon) {
            let copoun = await stripe.coupons.create({ percent_off: req.body.coupon.amount, duration: "once" })
            req.body.coupon = copoun.id
        }
        console.log(`${process.env.cancel_url}?order=${order._id.toString()}`);

        const sessions = await stripePayment({
            stripe,
            payment_method_types: ["card"],
            mode: "payment",
            metadata: {
                orderId: order._id.toString()
            },
            cancel_url: `${process.env.cancel_url}?orderId=${order._id.toString()}`,
            discounts: req.body.coupon ? [{ coupon: req.body.coupon }] : [],
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.productName
                        },
                        unit_amount: product.unitPrice * 100,
                    },
                    quantity: product.quantity

                }
            }),
        })
        return res.status(200).json({ message: "success", order, url: sessions.url })
    } else {
        return res.status(200).json({ message: "Done", order })
    }


}




export let cancelOrder = async (req, res, next) => {
    let { orderId } = req.params
    let { _id } = req.user
    let { reason } = req.body
    let order = await orderModel.findOne({ _id: orderId, createdBy: _id })
    if (!order) {
        return next(new ResError(`in-valid order id`, 400))
    }
    if ((order.paymentType == "cash" && order.status != "placed") || (order.paymentType == "card" && order.status != "waitToPayment")) {
        return next(new ResError(`can't cancel your order because it's ${order.status}`, 400))
    }
    let updateOrder = await orderModel.updateOne({ _id: orderId }, { status: "cancled", reason })
    if (!updateOrder.matchedCount) {
        return next(new ResError(`in-valid to canceled your order`, 400))
    }
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } })
    }
    if (order.coupon) {
        await couponModel.updateOne({ _id: order.coupon }, { $pull: { usedBy: _id } })
    }
    return res.status(200).json({ message: "success" })
}




export let deliveredOrder = async (req, res, next) => {
    let { orderId } = req.params
    let order = await orderModel.findOneAndUpdate({ _id: orderId, status: { $nin: ["rejected", "delivered", "canceled"] } }, { status: "delivered", updatedBy: req.user._id }, { new: true })
    if (!order) return next(new ResError(`in-valid order`, 400))
    return res.status(200).json({ message: "success", order })
}

export let cancelPayment = async (req, res, next) => {
    let { orderId } = req.query
    console.log(orderId);
    let order = await orderModel.findOne({ _id: orderId })
    if (!order) return next(new ResError(`in-valid order`, 400))
    for (let product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } }, { new: true })
    }
    return res.redirect("https://chat.openai.com/")
}