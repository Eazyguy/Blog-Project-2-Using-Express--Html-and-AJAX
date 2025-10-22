//getting the title tag
const metaTitle = document.querySelector('title')

// grabbing form document
const formTitle = document.querySelector('input[name=title]')
const formCategory = document.querySelector('select[name=category]')
const formBody = document.querySelector('textarea[name=body]')
const formFeatured = document.querySelector('input[name=featured]')
const formId = document.querySelector('input[name=id]')


//get a single post
const params = new URLSearchParams(window.location.search)
const title = params.get('title')
fetch(`http://localhost:3000/api/post/edit/${title}`)
.then(res=>res.json())
.then(post=>{
    //change the title element
    metaTitle.textContent = `EazyBlog - Edit: ${post.title.charAt(0).toUpperCase() + post.title.slice(1)}`

    //edit form data
    formId.value= post._id
    formTitle.value = post.title.charAt(0).toUpperCase() + post.title.slice(1)
    formCategory.value = post.category
    formBody.textContent = post.body
    
    // featured

    if(post.featured == 'on'){
        formFeatured.checked = true
    }else{
        formFeatured.checked = false
    }
    
})