import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { subCategoryModel } from "../../../../DB/Models/subCategory.Model.js"
import { brandModel } from "../../../../DB/Models/brand.Model.js"
import { nanoid } from "nanoid";
import { productModel } from "../../../../DB/Models/product.Model.js";
import { userModel } from "../../../../DB/Models/User.Model.js";
import { ApiFeatures } from "../../../utils/ApiFeaturesClass.js";



export let getAllProducts = async (req, res, next) => {
    let apiObj = new ApiFeatures(productModel.find().populate([{
        path: "reviews"
    }]), req.query).filter().paginate().sort().search().select()
    let products = await apiObj.mongooseQuery
    return res.status(200).json({ message: "success", products })
}



export let addProduct = async (req, res, next) => {
    let { _id } = req.user
    let { productName, price, discount, categoryId, subCategoryId, brandId } = req.body;
    if (!await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {
        return next(new ResError("In-valid Category Or Subcategory Id", 400));
    }
    if (!await brandModel.findOne({ _id: brandId })) {
        return next(new ResError("In-valid Brand Id", 400));
    }
    req.body.slug = slugify(productName);
    req.body.finalPrice = Number.parseFloat(price - ((discount || 0) / 100) * price).toFixed(2);
    req.body.customId = nanoid();
    let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.folderName}/Product/${req.body.customId}/mainImage` });
    req.body.mainImage = { secure_url, public_id, folder };
    if (req.files?.subImages?.length) {
        req.body.subImages = []
        for (const image of req.files.subImages) {
            let { secure_url, public_id, folder } = await cloudinary.uploader.upload(image.path, { folder: `${process.env.folderName}/Product/${req.body.customId}/SubImages` })
            req.body.subImages.push({ secure_url, public_id, folder })
        }
    }
    req.body.createdBy = _id
    let product = productModel.create(req.body);
    return res.status(201).json({ message: "success", product })

}


export let updateProduct = async (req, res, next) => {
    let { productId } = req.params
    let { price, discount, categoryId, subCategoryId, brandId } = req.body;
    let product = await productModel.findById({ _id: productId })

    if (!product) {
        return next(new ResError("In-valid Product Id", 400));
    }
    if (!categoryId && subCategoryId) {
        if (await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {
            return next(new ResError("In-valid Subcategory or Category Id", 400));
        }
    }
    if (!brandId) {
        if (await brandModel.findOne({ _id: brandId })) {
            return next(new ResError("In-valid brand Id", 400));
        }
    }

    if (req.body.productName) {
        req.body.slug = slugify(req.body.productName)
    }

    req.body.finalPrice = (price || discount) ? Number.parseFloat((price || product.price) - (((discount || product.discount) / 100) * (price || product.price))).toFixed(2) : product.finalPrice

    if (req.files?.mainImage?.length) {
        let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.folderName}/Product/${product.customId}/mainImage` });
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = { secure_url, public_id, folder };
    }

    if (req.files?.subImages?.length) {
        req.body.subImages = []
        for (const image of req.files.subImages) {
            let { secure_url, public_id, folder } = await cloudinary.uploader.upload(image.path, { folder: `${process.env.folderName}/Product/${product.customId}/SubImages` })
            product.subImages.map((ele) => { cloudinary.uploader.destroy(ele.public_id) })
            req.body.subImages.push({ secure_url, public_id, folder })
        }
    }
    req.body.updatedBy = req.user._id
    let updateproduct = await productModel.updateOne({ _id: product._id }, req.body, { new: true })
    return res.status(200).json({ message: "success", updateproduct })

}


export let wishList = async (req, res, next) => {
    let { productId } = req.params
    let { _id } = req.user
    if (!await productModel.findOne({ _id: productId, isDeleted: false })) {
        return next(new ResError("In-valid product", 400));
    }
    await userModel.updateOne({ _id }, { $push: { wishList: productId } })
    return res.status(200).json({ message: "success" })

}


export let removeFromWishlist = async (req, res, next) => {
    let { productId } = req.params
    let { _id } = req.user
    if (!await productModel.findOne({ _id: productId, isDeleted: false })) {
        return next(new ResError("In-valid product", 400));
    }
    await userModel.updateOne({ _id }, { $pull: { wishList: productId } })
    return res.status(200).json({ message: "success" })

}


export let getUserWishList = async (req, res, next) => {
    let user = await userModel.find().populate([
        {
            path: "wishList"
        }
    ])
    return res.status(200).json({ message: "success", user })
}

