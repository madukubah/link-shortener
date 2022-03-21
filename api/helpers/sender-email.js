'use strict'
const nodemailer = require('nodemailer')
const emailTemplate = require('../others/email-templates')

exports.send = async (result) => {
    const transporter = nodemailer.createTransport({
        service: result.service || 'gmail',
        host: result.host || 'smtp.gmail.com',
        port: result.port || 587,
        auth: {
            user: result.sender || 'ragilmanggalaning42@gmail.com',
            pass: result.password || 'ragilsyar\'i'
        }
    })

    const send = await transporter.sendMail({
        from: `${result.from} <${result.sender}>`, // sender address
        to: result.receiver, // list of receivers
        subject: result.subject, // Subject line
        text: result.text, // plain text body
        html: result.html, // html body
    })
}