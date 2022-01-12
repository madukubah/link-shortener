const http = require('http')
const env = require('dotenv')
env.config()

const mongo = require('./db/mongo.js')
const app = require('./app')
const port = process.env.PORT
const appIp = process.env.APP_IP
const server = http.createServer(app)

mongo.connect().then(() => {
    server.listen(port, appIp, () => {
        console.log('listening on port: '+port)
    })
})