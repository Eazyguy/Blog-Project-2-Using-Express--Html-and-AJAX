const postTitle = document.querySelector('.post-title')
const author = document.getElementById('author')
const date = document.getElementById('date')
const category = document.getElementById('category')
const containerBody = document.getElementById('container-body')
const edit = document.querySelector('.edit')
const metaTitle = document.querySelector('title')
const deletePost = document.querySelector('.delete')

//get a single post
const params = new URLSearchParams(window.location.search)
const title = params.get('title')
fetch(`/api/posts/${title}`)
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
    restBody.textContent = post.body.slice(1);
    edit.href = `/edit_post.html?title=${post.title}`
    deletePost.setAttribute('data-id',post._id)
    containerBody.appendChild(spanBody)
    containerBody.appendChild(restBody)

    //change the title element
    metaTitle.textContent = `EazyBlog - ${post.title.charAt(0).toUpperCase() + post.title.slice(1)}`
    
})

deletePost.addEventListener('click', e=>{
    const target = e.target.getAttribute('data-id')
    if(confirm('Are you sure you want to delete this post')){
        fetch(`/api/post/delete/${target}`,{
             method:'DELETE'
            })
        .then(()=>{
            alert('deleted')
            window.location.href='/dashboard.html'
        }).catch(err=>{
            alert('error deleting,couldn\' delete')
        })
    }
})