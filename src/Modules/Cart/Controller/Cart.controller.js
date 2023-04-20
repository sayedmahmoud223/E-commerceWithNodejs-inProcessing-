import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { categoryModel } from "../../../../DB/Models/category.Model.js";
import { productModel } from "../../../../DB/Models/product.Model.js"
import { cartModel } from "../../../../DB/Models/cart.Model.js";





export let createCart = async (req, res, next) => {
    let { productId, quantity } = req.body;
    let product = await productModel.findById({ _id: productId });
    if (!product) {
        return next(new ResError("in-valid product id", 400))
    }
    if (quantity > product.stock) {
        await productModel.findOneAndUpdate({ _id: productId }, { $addToSet: { wishList: req.user._id } })
        return next(new ResError("product quantity is out of stock", 400))
    }
    // find Cart
    let userCart = await cartModel.findOne({ createdBy: req.user._id });
    if (!userCart) {
        let createCart = await cartModel.create({
            createdBy: req.user._id,
            products: [{
                productId,
                quantity
            }]
        })
        return res.status(201).json({ message: "Done", createCart })
    }

    let checkMatch = false;
    for (let i = 0; i < userCart.products.length; i++) {
        if (userCart.products[i].productId.toString() == productId) {
            userCart.products[i].quantity = quantity;
            checkMatch = true;
            break;
        }
    }
    if (!checkMatch) {
        userCart.products.push({productId,quantity})
    }
    await userCart.save()
    return res.status(200).json({ message: "Done", userCart })
}



