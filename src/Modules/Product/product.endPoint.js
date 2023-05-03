import { Roles } from "../../Middleware/auth.middleware.js";


export let endPoint = {
    created: [Roles.isAdmin, Roles.issuperAdmin, Roles.isUser],
    updated: [Roles.isAdmin, Roles.issuperAdmin, Roles.isUser],
    deleted: [Roles.isAdmin, Roles.issuperAdmin]
}