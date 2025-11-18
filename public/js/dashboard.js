const dashboardContainer = document.getElementById('dashboard-container')
const listTemplate = document.getElementById('list-template')

const params = new URLSearchParams(window.location.search)
const page = params.get('page')

fetch(`/api/all-posts?page=${page || 1 }`)
.then(res=>res.json())
.then(data=>{
    const {post, totalPages, currentPage} = data
    
    // display all posts
    post.forEach(data => {

    const clone = listTemplate.content.cloneNode('true')
        clone.querySelector('.title').textContent = data.title.charAt(0).toUpperCase() + data.title.slice(1)
         clone.querySelector('.title').href=`/posts.html?title=${data.title}`
        clone.querySelector('.author').textContent = data.author
        clone.querySelector('.category').textContent = data.category
        clone.querySelector('.edit').href=`/edit_post.html?title=${data.title}`
       clone.querySelector('.delete').setAttribute('data-id',data._id)
        dashboardContainer.appendChild(clone)
       
    });

// Pagination
const paginationContainer = document.getElementById('pagination-container')
const paginationTemplate = document.getElementById('pagination-template')
const clone = paginationTemplate.content.cloneNode('true')
const pagination = clone.querySelector('.pagination-list')
for(let i=1; i <= totalPages; i++){

const li = document.createElement('li')
li.className = `page-item ${i == currentPage ? 'active':'' }`

const pglink = document.createElement('a')
pglink.className = 'btn rounded-0 page-link'
pglink.textContent = i
pglink.href=`/dashboard.html?page=${i}`
pglink.disabled = (i == currentPage)

li.appendChild(pglink)
pagination.appendChild(li)
paginationContainer.appendChild(pagination)

}
 
// delete post
const deletePost = document.querySelectorAll('.delete')

deletePost.forEach(del=>{
del.addEventListener('click', e=>{
    const target = e.target.getAttribute('data-id')
    console.log(target)
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
})

})

// search
const searchBtn = document.getElementById('search-btn')
const searchInput = document.querySelector('input[type=search]')

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = `/search.html?search=${encodeURIComponent(searchInput.value)}`
})
