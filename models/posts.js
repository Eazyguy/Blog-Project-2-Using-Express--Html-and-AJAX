const mongoose = require('mongoose')

let postSchema = mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }

})

let Posts = module.exports = mongoose.model('Posts', postSchema)