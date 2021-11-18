if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express")
const router = require("./routes/users")
const app = express()
const bcrypt = require('bcrypt')
//const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const photoRouter = require('./routes/photos')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))
// app.use(flash())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
 
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/photos', photoRouter)

app.listen(process.env.PORT || 3000) 