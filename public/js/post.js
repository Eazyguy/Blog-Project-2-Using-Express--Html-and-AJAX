const postTitle = document.querySelector('.post-title')
const author = document.getElementById('author')
const date = document.getElementById('date')
const category = document.getElementById('category')
const containerBody = document.getElementById('container-body')

//get a single post
const params = new URLSearchParams(window.location.search)
const title = params.get('title')
fetch(`http://localhost:3000/api/posts/${title}`)
.then(res=>res.json())
.then(post=>{
    postTitle.textContent = post.title.charAt(0).toUpperCase() + post.title.slice(1)
    author.textContent = post.Author
    date.textContent = post.date
    category.textContent = post.category
    const firstLetter = post.body.charAt(0).toUpperCase()
    const spanBody = document.createElement('span')
    spanBody.textContent = firstLetter
    spanBody.style.fontSize = '2rem'
    const restBody = document.createElement('span')
    restBody.textContent = post.body.slice(1)
    containerBody.appendChild(spanBody)
    containerBody.appendChild(restBody)
})