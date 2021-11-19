const express = require("express")
const router = express.Router()
const User = require('../models/user')
const Photo = require('../models/photo')
const bcrypt = require('bcrypt')
// const passport = require('passport')

// const initializePassport = require('../passport-config')
// initializePassport(
//     passport, 
//     email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
// )

// GET Users Route
router.get("/", async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const users = await User.find(searchOptions)
        res.render('users/index', { 
            users: users, 
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
    }
    
})

// Login route
router.get('/login', (req, res) => {
    res.render('users/login')
})

// New User Route
router.get("/register", (req, res) =>{
    res.render('users/register', { user: new User() })
})

// Create User Route
router.post('/',    async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const newUser = await user.save()
        // users.push({
        //     id: Date.now().toString(),
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: hashedPassword
        // })
        res.redirect('/users/login')        
    } catch (error) {
        console.log(error)
        res.render('users/register', {
            user: user,
            errorMessage: 'Error creating User'              
        })
    }     
})

// router.get('/login', checkNotAuthenticated, (req, res) => {
//     res.render('users/login')
// })

// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/users/login',
//     failureFlash: true
// }))

router.delete('/:id', async (req,res) => {
    let user  
    try {
        user = await User.findById(req.params.id)        
        await user.remove()
        res.redirect('/users')        
    } catch (error) {
        if (user == null) {
            res.redirect('/')
        } else {
            res.redirect(`/users/${user.id}`)            
        }        
    } 
})

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect('/login')
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/')
//     }
//     next()
// }

module.exports = router