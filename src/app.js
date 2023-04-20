import { globalError } from "./utils/asyncHandler.js";
import auth from "./Modules/auth/auth.router.js"
import category from "./Modules/category/category.router.js"
import coupon from "./Modules/Coupon/Coupon.router.js"
import brand from "./Modules/Brands/brand.router.js"
import product from "./Modules/Product/product.router.js"
import cart from "./Modules/cart/cart.router.js"
import order from "./Modules/Order/order.router.js"
import morgan from "morgan";

export let initApp = (app, express) => {

    app.use(morgan("dev"));
    app.use(express.json());
    app.use("/auth", auth);
    app.use("/category", category);
    app.use("/coupon", coupon);
    app.use("/brand", brand)
    app.use("/product", product)
    app.use("/cart", cart)
    app.use("/order", order)
    app.use(globalError);
}