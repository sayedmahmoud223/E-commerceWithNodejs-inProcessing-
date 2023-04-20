import * as couponController from "./Controller/Coupon.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileUploud, fileValidation } from "../../utils/multer.Cloudinary.js";
import { checkAuth } from '../../Middleware/auth.middleware.js'
import { endPoint } from "./Coupon.endPoint.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { addCouponSchema, updateCouponSchema } from "./Coupon.Validation.js";
let router = Router();

router.post("/",checkAuth(endPoint.created), fileUploud(fileValidation.image).single("image"), Validation(addCouponSchema),asyncHandler(couponController.addCoupon))
router.put("/:couponId", checkAuth(endPoint.updated), fileUploud(fileValidation.image).single("image"), Validation(updateCouponSchema),asyncHandler(couponController.updatecoupon))



export default router