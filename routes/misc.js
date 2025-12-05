const express = require("express");
const router = express.Router()
const {flash, uploadImage,} = require('../controllers/miscControllers')

// flash notification
router.get('/flash', flash)

// uploads
router.post('/upload', uploadImage)



module.exports = router