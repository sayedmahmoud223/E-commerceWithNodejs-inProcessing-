import { userModel } from "../../DB/Models/User.Model.js";
import { ResError } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.methods.js";

export let Roles = {
    isAdmin: "Admin",
    isUser: "User",
    issuperAdmin: "superAdmin",
    isHr: "Hr",
}

export let checkAuth = (accessRoles = []) => {
    return async (req, res, next) => {
        let { token } = req.headers;
        if (!token) {
            return next(new ResError("token is requierd", 400))
        }
        if (!token?.includes(process.env.tokenSecretKey)) {
            return next(new ResError("token is invalid or Bearer key", 400))
        }
        let theToken = token.replace(process.env.tokenSecretKey, "")
        if (!theToken) {
            return next(new ResError("token is invalid", 400))
        }
        let { id } = verifyToken({ token: theToken, signature: process.env.SIGNATURE })
        if (!id) {
            return next(new ResError("token is invalid payload", 400))
        }
        let userData = await userModel.findById({ _id: id })
        if (!userData) {
            return next(new ResError("invalid user account", 401))
        }
        if (userData.status == "Blocked") {
            return next(new ResError("Blocked account", 403))
        }
        if (userData.status == "Offline") {
            return next(new ResError("you must be login account", 403))
        }
        if (!accessRoles.includes(userData.role)) {
            return next(new ResError("not authorization account", 403))
        }
        req.user = userData
        return next();
    }
}