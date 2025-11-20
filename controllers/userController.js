const{check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
let User = require('../models/user')

//@desc add user
//route POST /api/addUser

const addUser = (req, res) => {
    const {username, firstname, surname, email, password, confirm} = req.body
    console.log(password)
    let errors = validationResult(req)

    console.log(errors.array())

    if(!errors.isEmpty()){
        req.session.message = {
        type:'danger',
        message: errors.array()
      }
      res.redirect('/admin-register.html')
    } else{
        bcrypt.hash(password,10).then(hashed=>{
            const newUser = new User({
                username, 
                firstname,
                surname,
                email,
                password:hashed
            })
            return newUser.save().then(()=>{
            req.session.message = {
            type:'success',
            message: 'user successfully registered'
      }
     return res.redirect('/admin-login.html')
        })
        })
    }
}
module.exports = {addUser}