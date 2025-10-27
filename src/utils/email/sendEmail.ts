import nodemailer from "nodemailer"

export const sendEmail = async({to, subject, html}:{
    to: string,
    subject: string,
    html: string
}) => {
    const transportOptions = {
        host: process.env.HOST ,
        port: process.env.PORT_EMAIL as unknown as number,
        secure: true,
        service: "gmail",
        auth:{
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL
        }
    }
    const transporter = nodemailer.createTransport(transportOptions)
    const main = async () => {
        const info = await transporter.sendMail({
            from: `Social App <${process.env.USER_EMAIL}>`,
            to,
            subject,
            html
        })
    }
    main().catch((error)=>{
        console.log({error});
    })


}