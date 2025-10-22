const express = require("express");
const router = express.Router()
const {check, validationResult} = require('express-validator')
const {
    getPost, 
    getSinglePosts, 
    getCategory, 
    addPost, 
    getAllPost, 
    updatePost,
    deletePost
} = require('../controllers/postControllers')


//fetch all post grouped by categories, limit=5
router.get('/posts', getPost)

//fetch all posts
router.get('/all-posts', getAllPost)

// fetch distinct categories included in all post
router.get('/categories', getCategory)

// fetch single post
router.get('/posts/:title', getSinglePosts)

//validation
var validation = [
    check('title', 'Title is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
    check('body','Body is required').notEmpty()
]

//Add posts
router.post('/posts/add', validation, addPost)

//Edit single post
router.get('/post/edit/:title', getSinglePosts)

//update single post
router.post('/posts/edit', updatePost)

//delete single post
router.delete('/post/delete/:id', deletePost)


module.exports = router