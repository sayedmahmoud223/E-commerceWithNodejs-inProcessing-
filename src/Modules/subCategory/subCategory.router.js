import * as subCategoryController from "./Controller/subCategory.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileUploud, fileValidation } from "../../utils/multer.Cloudinary.js";
let router = Router({ mergeParams: true });

router.post("/", fileUploud(fileValidation.image).single("image"), asyncHandler(subCategoryController.addsubCategory))
router.put("/:subCategoryId", fileUploud(fileValidation.image).single("image"), asyncHandler(subCategoryController.updatesubCategory))



export default router