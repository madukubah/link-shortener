const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const indexRouter = require('./api/routes/index');
const authRouter = require('./api/routes/auth');
const memberRouter = require('./api/routes/member');
const depositRouter = require('./api/routes/deposit');
const userRouter = require('./api/routes/user');
const loanContractRouter = require('./api/routes/loan-contract');
const installmentRouter = require('./api/routes/installment');
const branchOfficeRouter = require('./api/routes/branch-office');
const articleRouter = require('./api/routes/article');
const provinceRouter = require('./api/routes/province');
const cityRouter = require('./api/routes/city');
const productRouter = require('./api/routes/product');
const productCategoryRouter = require('./api/routes/product-category');
const dashboardRouter = require('./api/routes/dashboard');
const summaryCutRouter = require('./api/routes/summary-cut');
const saleOrderCutRouter = require('./api/routes/sale-order');
const pointRouter = require('./api/routes/point');

const mobileAuthRouter = require('./api/routes/mobile/auth');
const mobileDepositRouter = require('./api/routes/mobile/deposit');
const mobileArticleRouter = require('./api/routes/mobile/article');
const mobileLoanContractRouter = require('./api/routes/mobile/loan-contract');
const mobileInstallmentRouter = require('./api/routes/mobile/installment');
const mobileProductCategoryRouter = require('./api/routes/mobile/product-category');
const mobileProductRouter = require('./api/routes/mobile/product');
const mobileSaleOrderRouter = require('./api/routes/mobile/sale-order');
const mobileSaleOrderLineRouter = require('./api/routes/mobile/sale-orderline');
const mobilePointRouter = require('./api/routes/mobile/point');
const mobileInfoRouter = require('./api/routes/mobile/info');
const mobileBankRouter = require('./api/routes/mobile/bank');
const mobileMemberRouter = require('./api/routes/mobile/member');


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
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/member', memberRouter);
app.use('/deposit', depositRouter);
app.use('/user', userRouter);
app.use('/loan-contract', loanContractRouter);
app.use('/installment', installmentRouter);
app.use('/branch-office', branchOfficeRouter);
app.use('/article', articleRouter);
app.use('/province', provinceRouter);
app.use('/city', cityRouter);
app.use('/product', productRouter);
app.use('/product-category', productCategoryRouter);
app.use('/dashboard', dashboardRouter);
app.use('/summary-cut', summaryCutRouter);
app.use('/sale', saleOrderCutRouter);
app.use('/point', pointRouter);

app.use('/mobile/auth', mobileAuthRouter);
app.use('/mobile/deposit', mobileDepositRouter);
app.use('/mobile/article', mobileArticleRouter);
app.use('/mobile/loan-contract', mobileLoanContractRouter);
app.use('/mobile/installment', mobileInstallmentRouter);
app.use('/mobile/product-category', mobileProductCategoryRouter);
app.use('/mobile/product', mobileProductRouter);
app.use('/mobile/sale', mobileSaleOrderRouter);
app.use('/mobile/sale-orderline', mobileSaleOrderLineRouter);
app.use('/mobile/point', mobilePointRouter);
app.use('/mobile/info', mobileInfoRouter);
app.use('/mobile/bank', mobileBankRouter);
app.use('/mobile/member', mobileMemberRouter);

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
