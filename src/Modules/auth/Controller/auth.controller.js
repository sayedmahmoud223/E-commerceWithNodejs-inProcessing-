import { nanoid } from "nanoid";
import { userModel } from "../../../../DB/Models/User.Model.js";
import { ResError } from "../../../utils/asyncHandler.js";
import { comparePasswords, hashPassword } from "../../../utils/hashPassword.js";
import { makeToken, verifyToken } from "../../../utils/jwt.methods.js";
import { sendEmail } from "../../../utils/sendEmail.js";




export let Signup = async (req, res, next) => {
    let { userName, age, password, confirmPassword, email } = req.body;
    //in validation
    // if (password != confirmPassword) {
    //     return next(new ResError("paswword and Confirm password not match", 400))
    // }
    let user = await userModel.findOne({ email })
    if (user) {
        return next(new ResError("Email exist", 409))
    }
    let token = makeToken({ payload: { email }, signature: process.env.SIGNATURE, expiresIn: 60 * 5 });
    let Link = `http://localhost:5000/auth/confirmEmail/${token}`;
    let retoken = makeToken({ payload: { email }, signature: process.env.SIGNATURE, expiresIn: 60 * 60 * 24 * 30 });
    let reLink = `http://localhost:5000/auth/newConfirmEmail/${retoken}`;
    let html = `<a href="${Link}">Confirm your email</a>
    <br>
    <br>
    <a href="${reLink}">request new confirm email</a>
    `
    let send = await sendEmail(email, html)
    if (!send) {
        return next(new ResError("errrororrrrrr"))
    }
    let hashPass = hashPassword({ plainText: password })
    let createUser = await userModel.create({ userName, age, password: hashPass, email })
    return res.status(201).json({ message: "success", createUser })

}

export let confirmEmail = async (req, res, next) => {
    let { token } = req.params;
    let { email } = verifyToken({ token, signature: process.env.SIGNATURE })
    let updateUser = await userModel.findOneAndUpdate({ email }, { confirmEmail: true })
    return updateUser ? res.json("Done") : res.json("error")
    // return res.status(201).json({ message: "success", updateUser })
}


export let newConfirmEmail = async (req, res, next) => {
    let { token } = req.params;
    let { email } = verifyToken({ token, signature: process.env.SIGNATURE })
    let newtoken = makeToken({ payload: { email }, signature: process.env.SIGNATURE, expiresIn: 60 * 2 });
    let Link = `http://localhost:5000/auth/confirmEmail/${newtoken}`;
    let reLink = `http://localhost:5000/auth/newConfirmEmail/${token}`;
    let html = `<a href="${Link}">Confirm your email</a>
    <br>
    <br>
    <a href="${reLink}">request new confirm email</a>
    `
    let send = await sendEmail(email, html)
    if (!send) {
        return next(new ResError("errrororrrrrr"))
    }
    return res.json("done check tour email")

}



export let login = async (req, res, next) => {
    let { password, email } = req.body;
    let user = await userModel.findOne({ email })
    if (!user) {
        return next(new ResError("in-valid email", 404))
    }
    let check = comparePasswords({ plainText: password, cipher: user.password })
    if (!check) {
        return next(new ResError("in-valid password", 404))
    }
    if (!user.confirmEmail) {
        return next(new ResError("check confirm your email", 400))
    }
    let token = makeToken({ payload: { id: user._id, email: user.email }, signature: process.env.SIGNATURE, expiresIn: 60 * 60 * 24 * 30 })
    user.status = "Online";
    user.save();
    return res.status(201).json({ message: "success", token })

}

export let sendToResetPassword = async (req, res, next) => {
    let { email } = req.body;
    let forgetPassword = nanoid(4)
    let user = await userModel.findOneAndUpdate({ email }, { forgetPassword })
    if (!user) {
        return next(new ResError("in-valid email", 404))
    }

    let html = `<h1>${forgetPassword}</h1>`
    let send = await sendEmail(email, html)
    if (!send) {
        return next(new ResError("errrororrrrrr"))
    }
    return res.status(201).json({ message: "Check your email to change password"})
}

export let resetpassword = async (req, res, next) => {
    let {   email, password, confirmCode } = req.body;
    
    let user = await userModel.findOne({email})
    if(!user){
        return next(new ResError("invalid user account", 400))
    }
    if (user.forgetPassword != confirmCode) {
        return next(new ResError("invalid reset code", 400))
    }
    let newPass = hashPassword({ plainText: password })
    user.password = newPass;
    user.forgetPassword = undefined;
    user.status = "Offline";
    await user.save()
    return res.json({message: "Done"})

}

