import bcrypt from "bcryptjs"

export let hashPassword = ({ plainText = "", salt = parseInt(process.env.SALT) } = {}) => {
    let hash = bcrypt.hashSync(plainText, salt);
    return hash
}





export let comparePasswords = ({ plainText = "", cipher = "" } = {}) => {
    let checkPass = bcrypt.compareSync(plainText, cipher);
    return checkPass
}