const express = require('express')
const router = express.Router()
const {checkAuth, checkUser, logout, verifyPassword} = require('../controllers/authController')
const {admin} = require('../controllers/adminControllers')

//admin page
router.get('/admin', admin)

//logout
router.post('/logout', logout)

//check authentication
router.get('/check-auth', checkAuth)

//load user profile when logged
router.get('/check-user', checkUser)

//verify password
router.post('/verify-password', verifyPassword)

module.exports = router