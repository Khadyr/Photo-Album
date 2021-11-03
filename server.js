const express = require("express")
const router = require("./routes/users")
const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    console.log("Here")
    res.render("index")
})

const userRouter = require('./routes/users')

app.use('/users', userRouter)

app.listen(3000)