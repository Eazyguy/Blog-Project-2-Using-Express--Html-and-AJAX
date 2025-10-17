const express = require('express')
const path = require("path")
const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
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

//body parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//extend dayjs
dayjs.extend(advancedFormat)

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
    const title = req.params
    Posts.findOne(title).then(post=>{
        res.json(post)
    }).catch(()=>res.status(404).send('Not found'))
    
})

app.post('/api/posts/add', (req,res)=>{
    const post = new Posts()
    post.title = req.body.title
    post.category = req.body.category
    post.body = req.body.body
    post.featured = req.body.featured
    post.date = dayjs().format('Do MMMM YYYY')

    post.save().then(()=>{
        res.redirect('/')
    })
})

app.listen(3000, err=>{
    if(err)console.log(err)
        console.log("Server successfully connected")
}
)