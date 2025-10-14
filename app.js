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
    const {category, page = 1, limit=5} = req.query
    const skip = (Number(page)-1) * limit
    // const query = category ? {category} : {}
    Posts.countDocuments({category}).then(total=>{
        Posts.find({category})
        .sort()
        .skip(skip)
        .limit(Number(limit))
        .then((posts)=>{
    res.json({
        posts,
        totalPages:Math.ceil(total/limit),
        currentPage:(Number(page))
    })
    }).catch(err=>{
        console.log(err)
    })
    })
    
})

app.get('/api/categories', (req,res)=>{
    Posts.distinct('category').then(categories=>{
        res.json(categories)
    })
})

// fetch single post
app.get('/api/posts/:title', (req, res)=>{
    const title = req.query
    
})

app.listen(3000, err=>{
    if(err)console.log(err)
        console.log("Server successfully connected")
}
)