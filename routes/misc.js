const express = require("express");
const router = express.Router()
const {checkAuth} = require('../controllers/authController')
const {admin} = require('../controllers/adminControllers')
const {flash, upload, logout} = require('../controllers/miscControllers')

//check authentication
router.get('/check-auth', checkAuth)

// flash notification
router.get('/flash', flash)

// uploads
router.post('/upload', upload)

//admin page
router.get('/admin', admin)

//logout
router.post('/logout', logout)

module.exports = router