const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const {addUser} = require('../controllers/userController')
let User = require('../models/user')

const validation = [
    check('username', 'Username is required').notEmpty(),
    check('username').custom(async(username)=>{
        
        let query = await User.findOne({username:username})
       
        if(query){
            throw new Error("Username already Exist");  
        }else{
            return true
        }
     }),
    check('firstname', 'Firstname is required').notEmpty(),
    check('surname', 'surname is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('confirm').custom((confirm,{req})=>{
                if(confirm !== req.body.password){
            throw new Error('passwords do not match')
        }else{
            return true
        }
    }),
]

router.post('/register',validation, addUser)

module.exports = router