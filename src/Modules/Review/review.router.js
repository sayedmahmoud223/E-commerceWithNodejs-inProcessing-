import * as reviewController from "./Controller/review.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./review.endPoint.js";
import { addReviewSchema, updateReviewSchema } from "./review.Validation.js";
let router = Router({mergeParams: true});

router.post("/", checkAuth(endPoint.create), Validation(addReviewSchema), asyncHandler(reviewController.addReview))
router.put("/:reviewId", checkAuth(endPoint.update), Validation(updateReviewSchema), asyncHandler(reviewController.updateReview))




export default router