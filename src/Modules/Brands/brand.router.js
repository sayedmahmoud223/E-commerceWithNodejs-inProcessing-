import * as brandController from "./Controller/brand.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileUploud, fileValidation } from "../../utils/multer.Cloudinary.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./brand.endPoint.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { addBrandSchema } from "./brand.Validation.js";
let router = Router();

router.get("/", checkAuth(Object.values(Roles)), asyncHandler(brandController.findbrand))
router.post("/", checkAuth(endPoint.created), fileUploud(fileValidation.image).single("image"), Validation(addBrandSchema), asyncHandler(brandController.addBrand))
router.put("/:brandId", checkAuth(endPoint.updated), fileUploud(fileValidation.image).single("image"), asyncHandler(brandController.updateBrand))



export default router