const mongoose = require('mongoose')

let settingsSchema = mongoose.Schema({
    category: Array,
    password: String
})

let Settings = module.exports = mongoose.model('Settings', settingsSchema)