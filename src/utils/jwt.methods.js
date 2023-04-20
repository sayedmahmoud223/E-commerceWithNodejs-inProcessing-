import jwt from "jsonwebtoken"


export let makeToken = ({ payload = {}, signature = process.env.SIGNATURE, expiresIn } = {}) => {
    let token = jwt.sign(payload, signature, { expiresIn });
    return token
}


export let verifyToken = ({ token = "", signature = process.env.SIGNATURE } = {}) => {
    let decoded = jwt.verify(token, signature);
    return decoded
}