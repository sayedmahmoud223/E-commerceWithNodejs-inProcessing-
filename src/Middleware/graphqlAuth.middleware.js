import { userModel } from "../../DB/Models/User.Model.js";
import { ResError } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.methods.js";

export let Roles = {
    isAdmin: "Admin",
    isUser: "User",
    issuperAdmin: "superAdmin",
    isHr: "Hr",
}

export let checkAuthGraph = async (token ,accessRoles = []) => {
   
        if (!token) {
            throw new Error("token is requierd")
        }
        if (!token?.includes(process.env.tokenSecretKey)) {
            throw new Error("token is invalid or Bearer key")
        }
        let theToken = token.replace(process.env.tokenSecretKey, "")
        if (!theToken) {
            throw new Error("token is invalid")
        }
        let { id } = verifyToken({ token: theToken, signature: process.env.SIGNATURE })
        if (!id) {
            throw new Error("token is invalid payload")
        }
        let userData = await userModel.findById({ _id: id })
        if (!userData) {
            throw new Error("invalid user account")
        }
        if (userData.status == "Blocked") {
            throw new Error("Blocked account")
        }
        if (userData.status == "Offline") {
            throw new Error("you must be login account")
        }
        if (!accessRoles.includes(userData.role)) {
            throw new Error("not authorization account")
        }
        return userData
        
    }
