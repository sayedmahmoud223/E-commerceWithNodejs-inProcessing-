import * as cartController from "./Controller/Cart.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./cart.endPoint.js";
let router = Router();

router.post("/", checkAuth(endPoint.create), asyncHandler(cartController.createCart))



export default router