const mongoose = require('mongoose')

let settingsSchema = mongoose.Schema({
    category: String,
    password: String
})