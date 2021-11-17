const mongoose = require('mongoose')
const Photo = require('./photo')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

userSchema.pre('remove', function(next) {
    Photo.find({ user: this.id }, (err, photos) => {
        if (err) {
            next(err)
        } else if (photos.length > 0) {
            next (new Error('This user has photos still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('User', userSchema)