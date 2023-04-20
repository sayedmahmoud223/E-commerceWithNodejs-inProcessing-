import { couponModel } from "../../../../DB/Models/coupon.Model.js";
import { ResError } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloudinary.js"
import { categoryModel } from "../../../../DB/Models/category.Model.js"
import { subCategoryModel } from "../../../../DB/Models/subCategory.Model.js";

export let addCoupon = async (req, res, next) => {
    if (await couponModel.findOne({ couponName: req.body.couponName.toLowerCase() })) {
        return next(new ResError("coupon name is found", 400))
    }
    if (req.file) {
        let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Coupons` })
        req.body.couponImage = { secure_url, public_id, folder }
    }
    let coupon = await couponModel.create(req.body) // will add createdBy after user model

    return res.status(201).json({ message: "Done", coupon })
}


export let updatecoupon = async (req, res, next) => {
    let { couponId } = req.params;
    let { couponName, amount } = req.body;
    let coupon = await couponModel.findById({ _id: couponId, couponName })
    if (!coupon) {
        return next(new ResError("In-valid coupon ID", 400))
    }

    if (couponName == coupon.couponName) {
        return next(new ResError("In-valid coupon Name", 400))
    }

    if (req.body.amount || req.body.couponName || req.body.expireDate) {
        coupon.couponName = req.body.couponName || coupon.couponName
        coupon.amount = req.body.amount || coupon.amount
        coupon.expireDate = req.body.expireDate || coupon.expireDate
    }

    if (req.file) {
        let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/coupons` })
        if (coupon.couponImage?.public_id) {
            await cloudinary.uploader.destroy(coupon.couponImage?.public_id);
        }
        coupon.couponImage = { secure_url, public_id, folder }
    }

    await coupon.save()
    return res.status(201).json({ message: "Done", coupon })
}


