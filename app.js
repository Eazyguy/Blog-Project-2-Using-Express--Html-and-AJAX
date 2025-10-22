const express = require('express')
const path = require("path")
const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const session = require('express-session')
const post = require('./routes/post')
const mongoose = require('mongoose')
const app = express()

// Connect to MongoDb Database
mongoose.connect('mongodb://localhost/eazyblog')
let db = mongoose.connection
db.once('open', ()=>{ 
    console.log('Successfully connected to database')
})

app.use(express.static(path.join(__dirname, "public")))

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

//extend dayjs
dayjs.extend(advancedFormat)

app.get('/flash',(req,res)=>{
    const message = req.session.message
    delete req.session.message
    res.json(message || {})
})

app.listen(3000, err=>{
    if(err)console.log(err)
        console.log("Server successfully connected")
}
)