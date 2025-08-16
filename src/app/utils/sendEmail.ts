

import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "path"
import ejs from "ejs"
import AppError from "../errorHelpers/AppError"

const transporter = nodemailer.createTransport({


    secure: true,
    auth: {
        user: envVars.NODEMAILER.SMTP_USER,
        pass: envVars.NODEMAILER.SMTP_PASS
    },
    port: Number(envVars.NODEMAILER.SMTP_PORT),
    host: envVars.NODEMAILER.SMTP_HOST,
})


interface sendEmailOptions {
    to: string,
    templateName: string,
    templateData?: Record<string, any>
    subject: string,
    attachments?: {
        fileName: string,
        content: Buffer | string,
        contentType: string
    }[]

}


export const sendEmail = async ({
    to,
    subject,
    attachments,
    templateName,
    templateData,
}: sendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({


            from: envVars.NODEMAILER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.fileName,
                content: attachment.content,
                contentType: attachment.contentType
            }))



        })
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);

    } catch (error: any) {
        console.log(error.message);
        throw new AppError(401, "Email sending error")
    }

}