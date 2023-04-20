import { Roles } from "../../Middleware/auth.middleware.js";


export let endPoint = {
    created: [Roles.isAdmin, Roles.issuperAdmin],
    updated: [Roles.isAdmin, Roles.issuperAdmin],
    deleted: [Roles.isAdmin, Roles.issuperAdmin]
}