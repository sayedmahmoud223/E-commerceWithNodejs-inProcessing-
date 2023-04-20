import nodemailer from "nodemailer"


export async function sendEmail(to, html) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDEMAILEmail, // generated ethereal user
            pass: process.env.SENDEMAILPASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"sayed mahmoud 👻" <sbendary977@gmail.com>', // sender address
        to,
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html
    });

    console.log(info);
    return info.rejected.length ? false : true
}

