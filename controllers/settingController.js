const Settings = require('../models/settings')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//@desc Set Categories to use
//route POST /api/adjust category
const adJustCat = (req, res) =>{
    const {category} = req.body
    //check if exist
    Settings.findOne({category:{$in:category}}).then(cat=>{
             if(cat){
            Settings.updateOne({_id:cat._id}, {addToSet:{
                category:{each:category}
            }} )
            .then(()=>{
                req.session.message = {
            type:'success',
            message:'Category updated successfully'
             }
            res.redirect('/secure/settings.html')
            })
        }else{
            const newCat = new Settings({
                category
            })

            // checks if category field is empty then return error
            if(category.length === 0){
                req.session.message = {
            type:'danger',
            message:'Category can\'t be empty'
             }
             res.redirect('/secure/settings.html')
            }else{
            newCat.save().then(()=>{
                req.session.message = {
            type:'success',
            message:'Category created successfully'
             }
            res.redirect('/secure/settings.html')
            }
            )}
        }
    }).catch(err=>{
        console.error(err)
        req.session.message = {
            type:'danger',
            message:'An error occurred'
             }
            res.redirect('/secure/settings.html')
    })
}

//@desc update password
//route POST /update-password

const updatePassword = (req, res) => {

User.findOne({_id:req.session.userId})
.then(user=>{
    bcrypt.compare(req.body.password, user.password)
    .then(match=>{
        if(match){
            req.session.message = {
            type:'danger',
            message:'Can\'t update a password still in use'
             }
            res.redirect('/secure/settings.html')
        }else if( req.body.password !== req.body.confirm){
            req.session.message = {
            type:'danger',
            message:'Passwords do not march'
             }
            res.redirect('/secure/settings.html')
        }else if(!req.body.password || req.body.password.length < 1){
            req.session.message = {
            type:'danger',
            message:'Password fields can\'t be empty'
             }
            res.redirect('/secure/settings.html')
        }else {
            bcrypt.hash(req.body.password, 10)
            .then(hash=>{
                User.updateOne({_id:user._id},{password:hash})
                .then(()=>{
                req.session.message = {
                type:'success',
                message:'Password Successfully updated'
             }
            res.redirect('/secure/settings.html')
                })
            })
        }
    })
})

}

const categories = (req, res)=>{
    Settings.findOne({category:{$ne:true}})
    .then(cat=>{
        res.json(cat.category)
    })
}

module.exports = {adJustCat, updatePassword, categories}