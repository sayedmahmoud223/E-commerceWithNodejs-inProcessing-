import { Router } from "express"
import { Validation } from "../../Middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginSchema, resetpasswordSchema, sendToResetPasswordSchema, signupSchema } from "./auth.Validation.js";
import * as auth from "./Controller/auth.controller.js"
let router = Router();


router.post("/signup", Validation(signupSchema), asyncHandler(auth.Signup))
router.get("/confirmEmail/:token", asyncHandler(auth.confirmEmail))
router.get("/newConfirmEmail/:token", asyncHandler(auth.newConfirmEmail))
router.post("/login", Validation(loginSchema),asyncHandler(auth.login))
router.post("/sendToConfirmPass", Validation(sendToResetPasswordSchema),asyncHandler(auth.sendToResetPassword))
router.put("/resetpassword", Validation(resetpasswordSchema) ,asyncHandler(auth.resetpassword))
// router.get("/", checkAuth,fileUploud(fileValidation.image).single("image"),Validation(imageSchema),asyncHandler(auth.send))



export default router