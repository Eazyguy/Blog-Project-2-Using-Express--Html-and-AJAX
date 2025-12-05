const bcrypt = require('bcryptjs')
const User = require('../models/user')

//@desc check if user is authentcated
//route GET /check-auth
const checkAuth = (req, res)=>{
        res.json({authenticated:!!req.session.userId})
}

//@desc load user profile when logged in
//route GET /check-user

const checkUser = (req, res) =>{
   
    User.findOne({_id:req.session.userId}).then(user=>{
        if(user){
        res.json({
            profileImage: user.profileImage,
            username: user.username,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email
                    } )
    }else{
    res.status(401).json('error fetching user')
    }
    }).catch(err=>console.error(err))
}

//@desc upload route
//route POST /verify-password
const verifyPassword = (req, res) => {

        if(req.body){
        const query = {
    _id:req.session.userId
    }
    
    User.findOne(query)
    .then(user=>{
        bcrypt.compare(req.body.password, user.password)
        .then(match => {
            if(!match){
            req.session.message = {
            type:'danger',
            message: 'Wrong password'
            }
            return res.redirect('/secure/verify-password.html')
            }else{
                User.updateOne(query, {$set:req.session.tempUpdate})
                .then(()=>{
                    delete req.session.tempUpdate

                    req.session.message = {
                    type:'success',
                    message: 'Profile successfully updated'
                    }
                    return res.redirect('/secure/edit-profile.html')

                }).catch(err=>{
                    console.error(err)
                    req.session.message = {
                    type:'danger',
                    message: 'Error updating profile'
                    }
                    res.redirect('/secure/verify-password.html')

                })
            }
        })
    })
    
    }
    
}

//@desc upload route
//route POST /logout
const logout = (req, res)=>{
  req.session.destroy(err=>{
    if(err) {
      console.error(err)
      res.redirect('/secure/dashboard.html')
    }
    res.redirect('/')
  })
}
module.exports = {checkAuth, checkUser, logout, verifyPassword}