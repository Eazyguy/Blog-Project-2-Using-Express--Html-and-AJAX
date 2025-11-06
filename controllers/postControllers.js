const mongoose = require('mongoose')
const dayjs = require('dayjs')
const {validationResult, check} = require('express-validator')
const upload = require('../config/multer')

let Posts = require('../models/posts')

// @desc Get a list of posts grouped by category, limit=5
// @route GET /api/posts
const getPost =  (req,res)=>{
    const {category, page = 1, limit=5} = req.query
    const skip = (Number(page)-1) * limit
    // const query = category ? {category} : {}
    Posts.countDocuments({category}).then(total=>{
        Posts.find({category})
        .sort({date:-1})
        .skip(skip)
        .limit(Number(limit))
        .then((posts)=>{
    res.json({
        posts,
        totalPages:Math.ceil(total/limit),
        currentPage:(Number(page))
    })
    }).catch(err=>{
        console.log(err)
    })
    }) 
}

//@desc get all post
//@route /api/all-post
const getAllPost = (req, res) => {
    const {page=1,limit=10} = req.query
    const skip = (Number(page)-1) * limit
    Posts.countDocuments().then(total=>{
        Posts.find()
    .sort({date:-1})
    .skip(skip)
    .limit(Number(limit))
    .then(post=>{
        res.json({
            post,
            totalPages:Math.ceil(total/limit),
            currentPage:(Number(page))
        })
    })
    })
    
}

//@desc Get single Posts 
//@route /api/posts/title:
const getSinglePosts = (req, res)=>{
    const title = req.params
    Posts.findOne(title).then(post=>{
        res.json(post)
    }).catch(()=>res.status(404).send('Not found'))   
}

//@desc get Categories
//@route /api/category
const getCategory = (req,res)=>{
    Posts.distinct('category').then(categories=>{
        res.json(categories)
    })
}

//@desc add posts
//route POST /api/post/add

const addPost = (req,res)=>{

    const post = new Posts()
    post.title = req.body.title
    post.category = req.body.category
    post.body = req.body.body
    post.featured = req.body.featured
    post.date = dayjs().format('Do MMMM YYYY')
    post.featuredImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    post.keywords = req.body.keywords

    console.log(req.body)
    let errors = validationResult(req)

     console.log(errors.array())

     if(!errors.isEmpty()){
      req.session.message = {
        type:'danger',
        message: errors.array()
      }
      res.redirect('/add_post.html')
     }
     else{
        post.save().then(()=>{
        req.session.message = {
            type:'success',
            message:'Post added successfully'
        }
        res.redirect('/')
    })
     }
}

//@desc update post
//@route PUT /api/posts/edit/

const updatePost = (req, res) =>{
   const {title,category,body,featured} = req.body
   const updatedPost = {}
   updatedPost.title = title
   updatedPost.category = category
   updatedPost.body = body
   updatedPost.featured = featured ||''

   Posts.findByIdAndUpdate(req.body.id, updatedPost)
   .then(post=>{
    req.session.message = {
            type:'success',
            message:'Post updated successfully'
        }
        res.redirect('/')
   })

}

// @desc delete post
//@route /api/posts/delete/:id
const deletePost = (req,res)=>{
    const id = req.params.id
    Posts.deleteOne({_id:id})
    .then((del) => {
        if(del.deleteCount == 0){
            return res.status(404).send('error occured deleting')
        }else{
         return res.status(200).json({msg:'successfully deleted'})       
        }
        
    }).catch(err=>console.error(err))
}

module.exports = {
    getPost, 
    getSinglePosts, 
    getCategory, 
    addPost, 
    getAllPost, 
    updatePost, 
    deletePost
}