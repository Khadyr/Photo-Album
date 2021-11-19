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

// Shared Photo page
router.get('/shared', (req, res) => {
    res.render('photos/shared')
})

// Create Photo Route
router.post('/', async (req, res) => {    
    const photo = new Photo({
        title: req.body.title,
        user: req.body.user,
        publishDate: new Date(req.body.publishDate),
        geolocation: req.body.geolocation,        
        description: req.body.description
    })

    saveCover(photo, req.body.cover)

    try {
        const newPhoto = await photo.save()
        res.redirect(`photos/${newPhoto.id}`)
    } catch (error) {               
        renderNewPage(res, photo, true)
    }
})


// Show Photo Route
router.get('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id).populate('user').exec()
        res.render('photos/show', { photo: photo })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// Edit Photo Route
router.get("/:id/edit", async (req, res) =>{
    try {
        const photo = await Photo.findById(req.params.id)
        renderEditPage(res, photo)
    } catch (error) {
        res.redirect('/') 
    }    
})

// Update Photo Route
router.put('/:id', async (req, res) => {    
    let photo

    try {
        photo = await Photo.findById(req.params.id)
        photo.title = req.body.title
        photo.user = req.body.user
        photo.publishDate = new Date(req.body.publishDate)
        photo.geolocation = req.body.geolocation
        photo.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(photo, req.body.cover)
        }
        await photo.save()
        res.redirect(`/photos/${photo.id}`)
    } catch (error) {   
        if (photo != null) {
            renderEditPage(res, photo, true)
        } else {
            redirect('/')
        }     
       
    }
})

// Delete Photo Page
router.delete('/:id', async (req, res) => {
    let photo
    try {
        photo = await Photo.findById(req.params.id)
        await photo.remove()
        res.redirect('/photos')
    } catch (error) {
        if (photo != null) {
            res.render('photos/show', {
                photo: photo,
                errorMessage: 'Could not remove photo'
            })
        } else {
            res.redirect('/')
        }
    }
})



async function renderNewPage(res, photo, hasError = false) {
    renderFormPage(res, photo, 'new', hasError)
}

async function renderEditPage(res, photo, hasError = false) {
    renderFormPage(res, photo, 'edit', hasError)
}

async function renderFormPage(res, photo, form, hasError = false) {
    try {
        const users = await user.find({})
        const params = {
            users: users,
            photo: photo
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating photo'
            } else {
                params.errorMessage = 'Error Uploading photo'
            }
        }        
        res.render(`photos/${form}`, params)
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