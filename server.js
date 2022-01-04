const http = require('http')
const env = require('dotenv')
env.config()

const mongo = require('./db/mongo.js')
const app = require('./app')
const port = process.env.PORT
const server = http.createServer(app)

mongo.connect().then(() => {
    server.listen(port, () => {
        console.log('listening on port: '+port)
    })
})