import * as orderController from "./Controller/Order.controller.js"
import { Router } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Validation } from "../../Middleware/validation.middleware.js";
import { Roles, checkAuth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./order.endPoint.js";
let router = Router();

router.post("/", checkAuth(endPoint.create), asyncHandler(orderController.createOrder))



export default router