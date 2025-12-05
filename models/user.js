const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    profileImage:{
        type:String,
    },
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
})

let User = module.exports = mongoose.model('User',userSchema)