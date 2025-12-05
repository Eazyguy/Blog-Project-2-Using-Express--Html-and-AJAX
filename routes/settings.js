const express = require('express')
const router = express.Router()
const {adJustCat, updatePassword, categories} = require('../controllers/settingController')
const isAuthenticated = require('../middleware/authenticated')

//update category
router.post('/adjust-category', isAuthenticated, adJustCat)

//Change Password
router.post('/update-password', updatePassword)

//get categories
router.get('/categorySet', categories)
module.exports = router