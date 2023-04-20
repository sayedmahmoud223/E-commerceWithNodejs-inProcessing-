import joi from "joi"
import { generalValidation } from "../../Middleware/validation.middleware.js"

export let signupSchema = joi.object({
    userName: joi.string().min(3).max(150).required(),
    age: joi.number().min(18).max(80),
    password: generalValidation.password,
    confirmPassword: generalValidation.password.valid(joi.ref("password")),
    email: generalValidation.email,
    role: joi.string()
}).required()


export let loginSchema = joi.object({
    password: generalValidation.password,
    email: generalValidation.email
}).required()


export let sendToResetPasswordSchema = joi.object({
    email: generalValidation.email
}).required()


export let resetpasswordSchema = joi.object({
    password: generalValidation.password,
    email: generalValidation.email,
    confirmCode: joi.string().min(4).max(4).required()
}).required()


