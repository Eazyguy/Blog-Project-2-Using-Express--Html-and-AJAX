const express = require('express')
const path = require("path")
const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const session = require('express-session')
const post = require('./routes/post')
const user = require('./routes/user')
const mongoose = require('mongoose')
const config = require('./config/database')
const app = express()
const upload = require('./config/multer')

// Connect to MongoDb Database
mongoose.connect(config.database)
let db = mongoose.connection
db.once('open', ()=>{ 
    console.log('Successfully connected to database')
})

//public folder
app.use(express.static(path.join(__dirname, "public")))

//quill editor
app.use('/quill',express.static(path.join(__dirname,'node_modules/quill/dist')))

//bootstrap tag
app.use('/bootstrap5-tags',express.static(path.join(__dirname,'node_modules/bootstrap5-tags')))

console.log(path.join(__dirname,'node_modules/bootstrap5-tags'))

//body parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//express session middleware
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:8640000}
}))

//routes
app.use('/api', post)
app.use('/api', user)

//extend dayjs
dayjs.extend(advancedFormat)

// flash notification
app.get('/flash',(req,res)=>{
    const message = req.session.message
    delete req.session.message
    res.json(message || {})
})

// uploads
app.post('/upload', (req, res)=>{
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
})

app.listen(3000, err=>{
    if(err)console.log(err)
        console.log("Server successfully connected")
}
)