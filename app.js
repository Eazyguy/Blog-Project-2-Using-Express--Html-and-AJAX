const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const app = express()

// Connect to MongoDb Database
mongoose.connect('mongodb://localhost/eazyblog')
let db = mongoose.connection
db.once('open', ()=>{ 
    console.log('Successfully connected to database')
})

let Posts = require('./models/posts')

app.use(express.static(path.join(__dirname, "public")))

app.get('/api/posts', (req,res)=>{
    Posts.find().then((posts)=>{
        res.json(posts)
    }).catch(err=>{
        console.log(err)
    })
})

app.listen(3000, err=>{
    if(err)console.log(err)
        console.log("Server successfully connected")
}
)