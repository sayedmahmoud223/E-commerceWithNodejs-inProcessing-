import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { categoryModel } from "../../../../DB/Models/category.Model.js";
import { productModel } from "../../../../DB/Models/product.Model.js"
import { cartModel } from "../../../../DB/Models/cart.Model.js";
import { couponModel } from "../../../../DB/Models/coupon.Model.js";
import mongoose, { Types } from "mongoose";





export let createOrder = async (req, res, next) => {
    let { products, address, phone, couponName } = req.body;
    if (couponName) {
        let coupon = await couponModel.findOne({ couponName: couponName.toLowerCase(), usedBy: { $nin: req.user._id } });
        if (!coupon || (Date.now() > coupon.expireDate.getTime())) {
            return next(new ResError(`in-valid coupon`, 400))
        }
        await couponModel.findOneAndUpdate({couponName},{ $addToSet: { usedBy: req.user._id }})
        req.body.coupon = coupon
    }
    let finalOrderProductList = [];
    let sumTotal = 0;
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
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
        product.unitPrice = eachProduct.finalPrice;
        product.finalPrice = product.unitPrice * product.quantity;
        finalOrderProductList.push(product)
        sumTotal += product.finalPrice;
    }
    let dummyOrder = {
        createdBy: req.user._id,
        products: finalOrderProductList,
        coupon: req.body.coupon?._id,
        finalPrice: sumTotal - (((req.body.coupon?.amount || 0) / 100) * sumTotal),
        address,
        phone
    }
    // await couponModel.updateOne({usedBy: {$addToSet: req.user._id}})
    return res.status(200).json({ message: "Done", dummyOrder })
}



