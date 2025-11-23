//@desc upload route
//route POST /logout
const logout = (req, res)=>{
  req.session.destroy(err=>{
    if(err) {
      console.error(err)
      res.redirect('/secure/dashboard.html')
    }
    res.redirect('/')
  })
}

//@desc flash notification
//route GET /flash
const flash = (req,res)=>{
    const message = req.session.message
    delete req.session.message
    res.json(message || {})
}

//@desc upload route
//route POST /route
const upload = (req, res)=>{
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

module.exports = {flash, upload, logout}