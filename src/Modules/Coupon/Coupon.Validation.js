import joi from "joi"
import { generalValidation } from "../../Middleware/validation.middleware.js"
export let addCouponSchema = joi.object({
    couponName:joi.string().min(2).max(12).required(),
    expireDate:joi.date().greater(Date.now()).required(),
    amount:joi.number().positive().min(1).max(100).required(),
    couponId:generalValidation.optionalId,
    token:joi.string(),
    file: generalValidation.file,
}).required()
export let updateCouponSchema = joi.object({
    couponName:joi.string().min(2).max(12),
    expireDate:joi.date().greater(Date.now()),
    amount:joi.number().positive().min(1).max(100),
    couponId:generalValidation.id,
    file: generalValidation.file
}).required()