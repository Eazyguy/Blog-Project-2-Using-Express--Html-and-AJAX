const{validationResult} = require('express-validator')
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

//@desc add user
//route POST /api/login

const userLogin = (req, res)=>{
const {username, password} = req.body

console.log(password)
User.findOne({username})
.then((user)=>{
    if(!user){
        req.session.message = {
            type:'danger',
            message: 'User not found'
      }
      return res.redirect('/admin-login.html')
    }

    bcrypt.compare(password,user.password).then(match=>{
    console.log(match)
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

module.exports = {addUser, userLogin}