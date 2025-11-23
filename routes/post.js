const express = require("express");
const router = express.Router()
const upload = require('../config/multer')
const {check} = require('express-validator')
const {
    getPost, 
    getSinglePosts, 
    getCategory, 
    addPost, 
    getAllPost, 
    updatePost,
    searchPost,
    deletePost
} = require('../controllers/postControllers')
const isAuthenticated = require('../middleware/authenticated')


//fetch all post grouped by categories, limit=5
router.get('/posts', getPost)

//fetch all posts
router.get('/all-posts', isAuthenticated, getAllPost)

// fetch distinct categories included in all post
router.get('/categories', getCategory)

// fetch single post
router.get('/posts/:title', getSinglePosts)

var validation = [
    check('title', 'Title is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
    check('body','Body is required').notEmpty()
]

//Add posts
router.post('/posts/add', upload, validation, isAuthenticated, addPost)

//Edit single post
router.get('/post/edit/:title', isAuthenticated, getSinglePosts)

//update single post
router.post('/posts/edit', upload,isAuthenticated, updatePost)

//search
router.get('/search', searchPost)

//delete single post
router.delete('/post/delete/:id', isAuthenticated, deletePost)

//upload image files



module.exports = router