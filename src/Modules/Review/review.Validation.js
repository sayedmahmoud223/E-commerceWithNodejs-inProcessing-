import joi from "joi";
import { generalValidation } from "../../Middleware/validation.middleware.js";



export let addReviewSchema = joi.object({
    reviewDesc: joi.string().min(3).required(),
    rate: joi.number().positive().integer().min(1).max(5),
    productId: generalValidation.id,
    token: joi.string()
}).required();



export let updateReviewSchema = joi.object({
    productId: generalValidation.id,
    reviewId: generalValidation.id,
    reviewDesc: joi.string().min(3).required(),
    rate: joi.number().positive().integer().min(1).max(5),
    token: joi.string()
}).required();

