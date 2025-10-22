const dashboardContainer = document.getElementById('dashboard-container')
const listTemplate = document.getElementById('list-template')


fetch('/api/all-posts')
.then(res=>res.json())
.then(data=>{
    
    // display all posts
    data.forEach(data => {

    const clone = listTemplate.content.cloneNode('true')
        clone.querySelector('.title').textContent = data.title.charAt(0).toUpperCase() + data.title.slice(1)
         clone.querySelector('.title').href=`/posts.html?title=${data.title}`
        clone.querySelector('.author').textContent = data.author
        clone.querySelector('.category').textContent = data.category
        clone.querySelector('.edit').href=`/edit_post.html?title=${data.title}`
       clone.querySelector('.delete').setAttribute('data-id',data._id)
        dashboardContainer.appendChild(clone)
       
    });
 
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
