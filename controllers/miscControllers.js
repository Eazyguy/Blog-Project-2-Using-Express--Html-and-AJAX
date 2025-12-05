const upload = require('../config/multer')


//@desc flash notification
//route GET /flash
const flash = (req,res)=>{
      const message = req.session.message
    delete req.session.message
    res.json(message || {})
}

//@desc upload route
//route POST /route
const uploadImage = (req, res)=>{
    upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err)
      return res.status(500).json({ error: err.message || 'Upload failed' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    console.log('Uploaded ->', imageUrl)
    res.status(200).json({ url: imageUrl })
  })
}

module.exports = {flash, uploadImage}