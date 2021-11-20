const express = require("express")
const router = express.Router()
const User = require('../models/user')

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

// New User Route
router.get("/new", (req, res) =>{
    res.render('users/new', { user: new User() })
})

//let locals = { errorMessage: 'Error creating User'}

// Create User Route
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name
    })
    try {
        const newUser = await user.save()
        //res.redirect(`users/${newUser.id}`)
        res.redirect(`users`)
    } catch (error) {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'              
        })
    }     
})

router
    .route("/:id")
    .get((req, res) => {    
        res.send(`Get user with id ${req.params.id}`)
    })
    .put((req, res) => {    
        res.send(`Update user with id ${req.params.id}`)
    })
    .delete((req, res) => {    
        res.send(`Delete user with id ${req.params.id}`)
    })

module.exports = router