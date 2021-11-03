const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("User List")
})

router.get("/new", (req, res) =>{
    res.send("New User Form")
})

router.post('/', (req, res) => {
    res.send("Create user")
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