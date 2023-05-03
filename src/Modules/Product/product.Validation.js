import joi from "joi"
import {generalValidation} from "../../Middleware/validation.middleware.js"


export let addProductSchema = joi.object({
    productName: joi.string().min(3).max(150).required(),
    stock: joi.number().integer().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(0),
    colors: joi.array(),
    sizes: joi.array(),    
    description: joi.string().min(3).max(15000).optional(),
    brandId: generalValidation.id,
    subCategoryId: generalValidation.id,
    categoryId: generalValidation.id,
    file: joi.object({
        mainImage: joi.array().items(generalValidation.file).length(1).required(),
        subImages: joi.array().items(generalValidation.file).max(5)
    }).required(),
    token: joi.string()
}).required()

export let updateProductSchema = joi.object({
    productId: generalValidation.id,
    productName: joi.string().min(3).max(150),
    stock: joi.number().integer().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(0),
    colors: joi.array(),
    sizes: joi.array(),    
    description: joi.string().min(3).max(15000),
    brandId: generalValidation.optionalId,
    subCategoryId: generalValidation.optionalId,
    categoryId: generalValidation.optionalId,
    file: joi.object({
        mainImage: joi.array().items(generalValidation.file).length(1),
        subImages: joi.array().items(generalValidation.file).max(5)
    }),
    token: joi.string()
}).required()

export let wishListSchema = joi.object({
    productId: generalValidation.id,
    token: joi.string()
}).required()