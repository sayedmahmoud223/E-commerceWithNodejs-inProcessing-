import * as productController from "./Controller/product.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileUploud, fileValidation } from "../../utils/multer.Cloudinary.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./product.endPoint.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { addProductSchema, updateProductSchema } from "./product.Validation.js";
// import { addBrandSchema } from "./brand.Validation.js";
let router = Router();


router.post("/",
    checkAuth(endPoint.created),
    fileUploud(fileValidation.image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ]),
    Validation(addProductSchema),
    asyncHandler(productController.addProduct)
)


router.put("/:productId",
    checkAuth(endPoint.updated),
    fileUploud(fileValidation.image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ]),
    Validation(updateProductSchema),
    asyncHandler(productController.updateProduct)
)

export default router

