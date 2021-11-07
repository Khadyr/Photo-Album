const express = require("express")
const router = express.Router()
const Photo = require('../models/photo')
const user = require("../models/user")
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// Get Photos Route
router.get("/", async (req, res) => {
    let query = Photo.find()
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const photos = await query.exec()
        res.render('photos/index', {
            photos: photos,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')
    }    
}) 

// New Photo Route
router.get("/new", async (req, res) =>{
    renderNewPage(res, new Photo())
})

// Create Photo Route
router.post('/', async (req, res) => {    
    const photo = new Photo({
        title: req.body.title,
        user: req.body.user,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,        
        description: req.body.description
    })

    saveCover(photo, req.body.cover)

    try {
        const newPhoto = await photo.save()
        //res.redirect(`photos/${newPhoto.id}`)
        res.redirect(`photos`)
    } catch (error) {               
        renderNewPage(res, photo, true)
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

async function renderNewPage(res, photo, hasError = false) {
    try {
        const users = await user.find({})
        const photo = new Photo()
        const params = {
            users: users,
            photo: photo
        }
        if (hasError) params.errorMessage = 'Error Uploading Photo'
        res.render('photos/new', params)
    } catch (error) {
        res.redirect('/photos')
    }
}

function saveCover(photo, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        photo.coverImage = new Buffer.from(cover.data, 'base64')
        photo.coverImageType = cover.type
    }
}

module.exports = router