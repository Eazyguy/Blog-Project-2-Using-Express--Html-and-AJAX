const mongoose = require('mongoose')
const dayjs = require('dayjs')
const {validationResult, check} = require('express-validator')
const upload = require('../config/multer')
const cheerio = require('../config/cheerio')
const fs = require('fs/promises')
const path = require('path')

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
//@route /api/all-posts
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
//@route /api/categories
const getCategory = (req,res)=>{
    console.log(req.session)
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

    const uploadedImages = req.session.uploadedImages || []

    const usedImages = cheerio(req.body.body)
    
    //determine unused images
    const unusedImages = uploadedImages.filter(img=>!usedImages.includes(img))

    unusedImages.map(img=>{
        const url = new URL(img)
        const imageUrl = decodeURIComponent(url.pathname)
        const imagePath = path.join(__dirname,'..','public',imageUrl)

        fs.unlink(imagePath).catch(err=>console.error('deleting failed:', err))

        delete req.session.uploadedImages
    })

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
//@route POST /api/posts/edit/

const updatePost = (req, res) =>{
   const {title,category,body,featured, keywords} = req.body
   const updatedPost = {}
   updatedPost.title = title
   updatedPost.category = category
   updatedPost.body = body
   updatedPost.featured = featured ||''
   updatedPost.featuredImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   updatedPost.keywords = keywords

   Posts.findByIdAndUpdate(req.body.id, updatedPost)
   .then(post=>{
    req.session.message = {
            type:'success',
            message:'Post updated successfully'
        }
        res.redirect('/')
   })

}

// @desc search post
//@route /api/search
const searchPost = (req, res)=>{
    const {page=1,limit=10} = req.query
    const skip = (Number(page)-1) * limit
    const query = req.query.search
    
    Posts.countDocuments({$text:{$search:query}}).then(total=>{
        Posts.find({$text:{$search:query}},{score:{$meta:'textScore'}})
        .sort({score:{$meta:'textScore'}})
        .skip(skip)
        .limit(Number(limit))
    .then(result =>{
        res.json({
            result,
            totalPages:Math.ceil(total/limit),
            currentPage:(Number(page))
        })
    })
    })
    
}

// @desc delete post
//@route /api/posts/delete/:id
const deletePost = (req,res)=>{
    const id = req.params.id

    Posts.findOne({_id:id})
    .then(post =>{
        if(!post){
            res.status(404).send('Post not found')
        }

        // Extract image links from body
        const images = cheerio(post.body)
        const imageLinks = [post.featuredImage, ...images]
        
        const deletePromises = imageLinks.map(img=>{
            try {
            const url = new URL(img)
            const imageUrl = decodeURIComponent(url.pathname)
            const imagePath = path.join(__dirname,'..','public',imageUrl)

            return fs.unlink(decodeURIComponent(imagePath))
            .catch(err=>{
                console.warn('error deleting image', err)
            })
            } catch (error) {
                console.warn('image delete failed:', error.message)
                return Promise.resolve()
            }
        })

        return Promise.all(deletePromises).then(()=>{
           return Posts.deleteOne({_id:id})
        }) 
    }).then((del) => {
        if(del.deletedCount == 0){
            return res.status(405).send('error occured deleting')
        }else{
         return res.status(200).json({msg:'successfully deleted'})       
        }
    })
    
}

// @desc post 
//@route /api/posts/category

const postCat = (req, res) =>{
const {page=1,limit=10} = req.query
    const skip = (Number(page)-1) * limit
    const categoryQuery = req.query.category
    const keywordQuery = req.query.keyword

    let filter = {}

    if(categoryQuery) filter.category = categoryQuery

    if(keywordQuery) filter.keywords = {$in:[keywordQuery]}
    
        Posts.countDocuments(filter).then(total=>{
        Posts.find(filter)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(Number(limit))
    .then(result =>{
        res.json({
            result,
            totalPages:Math.ceil(total/limit),
            currentPage:(Number(page))
        })
    })
    })
    
}

const featuredPost = (req, res) => {

    const {category } = req.query

    Posts.find({featured:'on', category}).then(featured =>{
       res.json(featured)
    })

}

module.exports = {
    getPost, 
    getSinglePosts, 
    getCategory, 
    addPost, 
    getAllPost, 
    updatePost, 
    searchPost,
    deletePost,
    postCat,
    featuredPost
}