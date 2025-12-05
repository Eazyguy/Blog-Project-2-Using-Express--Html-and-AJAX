import Tags from '/bootstrap5-tags/tags.js'


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
    
    // form body
    quill.root.innerHTML = post.body
    
    // featured

    if(post.featured == 'on'){
        formFeatured.checked = true
    }else{
        formFeatured.checked = false
    }

           //categories
    fetch('/api/categories')
    .then(res=>res.json())
    .then(cat=>{
        const category = document.getElementById('category')
        
        const items = cat.map(op=> (
            {
            value: op, 
            label: op.charAt(0).toUpperCase() + op.slice(1), 
            selected: op == post.category?true:''
        }))

        console.log(items)
    
        Tags.init("#category",{
      'items': items,
      'max':5
    })
        
    })

     // featured image
    
    const featImg = document.createElement('img')
    featImg.src = post.featuredImage
    featImg.title = 'featured image of' + post.title
    featImg.alt = 'featured image of' + post.title
    document.querySelector('.image-preview').appendChild(featImg)

    // Featured Image Edit
const imgContainer = document.querySelector('.image-preview')
const fileInput = document.getElementById('preview')

fileInput.addEventListener('change', (e)=>{
    const file = e.target.files[0]
    
    if(file){
        const reader = new FileReader()
        reader.onload = (e)=>{
            const img = document.createElement('img')
            img.src = e.target.result;
            img.style.maxWidth = '250px';
            img.style.maxHeight = '250px'

            imgContainer.innerHTML = '';
            imgContainer.appendChild(img)
        }
        reader.readAsDataURL(file)
    }
})

    // keywords
    Tags.init("#keywords",{
      'items': [
        {value:'book', label:'book'},
        {value:'hand', label:'hand'},
        
      ],
      'max':5
    })
    
})

// search
const searchBtn = document.getElementById('search-btn')
const searchInput = document.querySelector('input[type=search]')

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = `/search.html?search=${encodeURIComponent(searchInput.value)}`
})