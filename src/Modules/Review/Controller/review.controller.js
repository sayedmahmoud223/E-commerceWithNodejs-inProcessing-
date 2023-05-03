import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { productModel } from "../../../../DB/Models/product.Model.js"
import { cartModel } from "../../../../DB/Models/cart.Model.js";
import { couponModel } from "../../../../DB/Models/coupon.Model.js";
import { orderModel } from "../../../../DB/Models/order.Model.js";
import { reviewModel } from "../../../../DB/Models/review.Model.js";





export let addReview = async (req, res, next) => {
    let { productId } = req.params
    let { rate, reviewDesc } = req.body
    let order = await orderModel.findOne({ createdBy: req.user._id, status: "delivered", "products.productId": productId })
    if (!order) {
        return next(new ResError("you must buy the product to review", 400))
    }
    if (await reviewModel.findOne({ orderId: order._id, createdBy: req.user._id, productId })) {
        return next(new ResError("already reviewed before by you", 400))
    }
    let review = await reviewModel.create({ rate, reviewDesc, createdBy: req.user._id, productId, orderId: order._id })
    return res.status(201).json({ message: "success", review })
}


export let updateReview = async (req, res, next) => {
    let { productId, reviewId } = req.params
    let order = await orderModel.findOne({ createdBy: req.user._id, status: "delivered", "products.productId": productId })
    if (!order) {
        return next(new ResError("you must buy the product to review", 400))
    }
    let review = await reviewModel.findOneAndUpdate({ orderId: order._id, _id: reviewId, createdBy: req.user._id, productId }, req.body, { new: true })
    if (!review) {
        return next(new ResError("in-valid review id", 400))
    }
    return res.status(201).json({ message: "success", review })
}


