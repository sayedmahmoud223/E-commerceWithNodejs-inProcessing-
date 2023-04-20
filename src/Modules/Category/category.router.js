import * as categoryController from "./Controller/category.controller.js"
import { Router } from "express"
import subCategoryRouter from "../subCategory/subCategory.router.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileUploud, fileValidation } from "../../utils/multer.Cloudinary.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { addCategorySchema, headers, updateCategorySchema } from "./category.Validation.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./category.endPoint.js";
let router = Router();

router.use("/:categoryId/subcategory", subCategoryRouter)
router.get("/", checkAuth(Object.values(Roles)), asyncHandler(categoryController.findSubCategoryAndCategory))
router.post("/", Validation(headers, true), checkAuth(endPoint.create), fileUploud(fileValidation.image).single("image"), Validation(addCategorySchema), asyncHandler(categoryController.addCategory))
router.put("/:categoryId", checkAuth(endPoint.update), fileUploud(fileValidation.image).single("image"), Validation(updateCategorySchema), asyncHandler(categoryController.updateCategory))



export default router