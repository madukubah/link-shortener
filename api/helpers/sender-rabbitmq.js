const amqp = require('amqplib')
const emailTemplate = require('../others/email-templates')
const { response } = require('express')

exports.send = async (result, type = 'resetPassword') => {
    let data = {}, datas = []
    if(type === 'resetPassword') {
        data = {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            sender: 'noreply@bee2beehub.com',
            password: 'Bestada-212',
            from: 'Bee2BeeHub (do not replay)',
            receiver: result.email,
            subject: 'Reset password',
            text: 'resetPassword',
            html: emailTemplate.reset(`${result.link}/${result.token}`)
            // html: emailTemplate.verify(`${process.env.BASE_URL}/accounts/${process.env.API_KEY}/verify/${result.token}`)
        }

        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URI)
            const channel = await connection.createChannel()
            await channel.assertQueue(process.env.QUEUE)
            channel.sendToQueue(process.env.QUEUE, Buffer.from(JSON.stringify(data)))
        }catch(error) {
            console.log('failed send to rabbitMQ', error)
        }
    }
}