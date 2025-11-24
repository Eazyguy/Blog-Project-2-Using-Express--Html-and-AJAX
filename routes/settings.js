const express = require('express')
const router = express.Router()
const {adJustCat} = require('../controllers/settingController')
const isAuthenticated = require('../middleware/authenticated')

//update category
router.post('/adjust-category', isAuthenticated, adJustCat)

module.exports = router