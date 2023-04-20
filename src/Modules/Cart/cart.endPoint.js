import { Roles } from "../../Middleware/auth.middleware.js";


export let endPoint = {
    create: [Roles.isUser],
    update: [Roles.isAdmin, Roles.isUser],
    delete: [Roles.isAdmin, Roles.issuperAdmin],
    get: [Roles.isAdmin, Roles.isUser, Roles.isHr, Roles.issuperAdmin],
}