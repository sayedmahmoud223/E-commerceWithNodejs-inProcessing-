import joi from "joi";
import { generalValidation } from "../../Middleware/validation.middleware.js";



export let addCategorySchema = joi.object({
    categoryName: joi.string().required(),
    token: joi.string(),
    file:generalValidation.file.required()
}).required();


export let updateCategorySchema = joi.object({
    categoryName: joi.string().required(),
    token: joi.string(),
    file:generalValidation.file
}).required();

export let headers = joi.object({
    token: joi.string().required(),
}).required();
