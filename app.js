const express = require('express')
const path = require("path")
const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const session = require('express-session')
const post = require('./routes/post')
const user = require('./routes/user')
const misc = require('./routes/misc')
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

//protected html files
const secureStatic = express.static(path.join(__dirname,'protected'))
app.use('/secure', (req, res, next) =>{
   if(req.session && req.session.userId){
    return secureStatic(req,res,next)
}
req.session.message = {
            type:'danger',
            message:'Access Denied, Please Login'
        }
return res.redirect('/admin-login.html')
})

//routes
app.use('/api', post)
app.use('/api', user)
app.use('/', misc)

//extend dayjs
dayjs.extend(advancedFormat)



app.listen(3000, err=>{
    if(err)console.log(err)
        console.log("Server successfully connected")
}
)