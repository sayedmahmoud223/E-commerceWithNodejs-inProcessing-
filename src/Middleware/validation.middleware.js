import joi from "joi"
import { Types } from "mongoose"

export let checkId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("in-valid Object id")
}



export let generalValidation = {
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 2, tlds: ["com", "net"] }).regex(/^[\w]{0,20}@(gmail|yahoo|hotmail)\.(com|net)$/).required(),
    password: joi.string().min(8).max(200).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%^&*@]).{8,}$/).required(),
    id: joi.string().custom(checkId).required(),
    optionalId: joi.string().custom(checkId),
    file: joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        mimetype:joi.string().required(),
        encoding:joi.string().required(),
        originalname:joi.string().required(),
        fieldname:joi.string().required(),
    })
}


export function Validation(Schema, considerHeaders = false) {
    return (req, res, next) => {
        let copyreq = { ...req.body, ...req.params, ...req.query }
        if (req.headers?.token) {
            copyreq.token = req.headers.token
        }
        if (req.file || req.files) {
            copyreq.file = req.file || req.files
        }

        let { error } = Schema.validate(copyreq, { abortEarly: false })
        if (error) {
            let listOfError = error.details.map((ele) => ele.message)
            return res.json({ message: listOfError })
        } else {
            return next();
        }
    }
}
