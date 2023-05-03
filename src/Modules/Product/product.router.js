import * as productController from "./Controller/product.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileUploud, fileValidation } from "../../utils/multer.Cloudinary.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./product.endPoint.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { addProductSchema, updateProductSchema, wishListSchema } from "./product.Validation.js";
import reviewRouter from "../Review/review.router.js"
// import { addBrandSchema } from "./brand.Validation.js";
let router = Router();

router.use("/:productId/review", reviewRouter)
// router.get("/",asyncHandler(productController.getUserWishList))
router.get("/",asyncHandler(productController.getAllProducts))

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

router.patch("/wishlist/:productId",checkAuth(endPoint.created),Validation(wishListSchema),asyncHandler(productController.wishList))

router.patch("/wishlist/:productId/remove", checkAuth(endPoint.deleted),Validation(wishListSchema),asyncHandler(productController.removeFromWishlist))

export default router

