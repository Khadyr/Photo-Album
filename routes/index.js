const express = require('express')
const router = express.Router()
const Photo = require('../models/photo')

router.get('/', async (req, res) => {
    let photos
    try {
        photos = await Photo.find().sort({ createAt: 'desc'}).limit(10).exec()
    } catch (error) {
        photos = []
    }
    res.render('index', { photos: photos})
})

module.exports = router