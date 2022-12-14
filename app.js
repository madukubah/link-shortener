const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const indexRouter = require('./api/routes/index');
const authRouter = require('./api/routes/auth');
const userRouter = require('./api/routes/user');
const linkRouter = require('./api/routes/link');
const visitRouter = require('./api/routes/visit');


app.use(helmet())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/downloads', express.static('downloads'))

// handle CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-API-KEY, X-Requested-With, Content-Type, Accept, Authorization, Timezone')
    if(request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return response.status(200).json({})
    }
    next()
})

//api
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/link', linkRouter);
app.use('/visit', visitRouter);
app.use('/', indexRouter);

// handle error
app.use((request, response, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, request, response, next) => {
    return response.status(error.status || 500).json({
        status: false,
        error: error.message || 'SERVER ERROR'
    })
})

module.exports = app
