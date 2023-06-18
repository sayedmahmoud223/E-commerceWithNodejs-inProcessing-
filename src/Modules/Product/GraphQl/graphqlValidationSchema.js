import Joi from "joi";
import { generalValidation } from "../../../Middleware/validation.middleware.js";

export let updateStockValidation = Joi.object({
    token:Joi.string(),
    _id: generalValidation.id,
    stock: Joi.number().positive(),
    productName: Joi.string(),
    colors: Joi.array(),
    description: Joi.string(),
    slug: Joi.string(),
    price: Joi.number().positive(),
    discount: Joi.number().positive(),
}).required()
