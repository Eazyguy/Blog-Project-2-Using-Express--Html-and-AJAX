
const mongoose = require('mongoose')

let postSchema =  mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    author:{
        type: String,
        required: true,
        default:'Israel'
    },
    category:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true,
    },
    featured:{
        type:String
    },
    featuredImage:{
        type: String
    },
    keywords:{
        type: Array
    }
},{
    timestamps:true,
})

let Posts = module.exports = mongoose.model('Posts', postSchema)