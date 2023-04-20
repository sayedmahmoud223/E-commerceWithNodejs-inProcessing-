import joi from "joi"
import {generalValidation} from "../../Middleware/validation.middleware.js"


export let addBrandSchema = joi.object({
    brandName: joi.string().min(3).max(150).required(),
    file: generalValidation.file.required(),
    token: joi.string()
}).required()