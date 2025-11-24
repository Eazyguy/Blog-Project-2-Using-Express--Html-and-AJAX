const Settings = require('../models/settings')

const adJustCat = (req, res) =>{
    const {category} = req.body
    
    //check if exist
    Settings.findOne().then(cat=>{
        if(cat){
            Settings.updateOne(cat, category )
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
    })
}

module.exports = {adJustCat}