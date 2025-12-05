const{validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
let User = require('../models/user')
const { request } = require('express')

//@desc add user
//route POST /api/addUser

const addUser = (req, res) => {
    const {username, firstname, surname, email, password, } = req.body
    
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

//@desc add user
//route POST /api/login

const userLogin = (req, res)=>{
const {username, password} = req.body

User.findOne({username})
.then((user)=>{
    if(!user){
        req.session.message = {
            type:'danger',
            message: 'User not found'
      }
      return res.redirect('/admin-login.html')
    }

    return bcrypt.compare(password,user.password).then(match=>{
       if(!match){
        req.session.message = {
            type:'danger',
            message: 'Wrong password'
      }
      return res.redirect('/admin-login.html')
    }

    req.session.userId = user._id;
    req.session.message = {
            type:'success',
            message: 'Login Successful'
      }
      req.session.save(err=>{
        if(err){
            console.error('Error saving session:',err);
            return res.redirect('/admin-login.html')
        }
      })
      return res.redirect('/secure/dashboard.html')

})

}).catch(err => {
    console.error(err)
    req.session.message = {
            type:'danger',
            message: 'An error occured'
      }
      return res.redirect('/admin-login.html')
})

}

//@desc add user
//route POST /api/profile-edit

const editProfile = (req,res) => {
const updated = {
    ...req.body,
    profileImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
}

req.session.tempUpdate = updated

res.redirect('/secure/verify-password.html')

}
module.exports = {addUser, userLogin, editProfile}