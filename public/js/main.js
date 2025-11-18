let postCard = document.getElementById('post-list')
let template = document.getElementById('card-template')
let spinner = document.getElementById('spinner')

fetch('/api/categories')
.then(res => res.json())
.then(categories =>{
    categories.forEach(cat => {
        listPost(cat,1)
    });
})

let listPost =(category,page)=>{

 spinner.style.display = 'block'
 const existing = postCard.querySelector(`[data-category="${category}"]`)
 
    if(existing){
        // Show spinner in this card
        const cardSpinner = existing.querySelector('#card-spinner')
        console.log(cardSpinner)
        if(cardSpinner) cardSpinner.style.display = 'block'
    }

    fetch(`/api/posts?category=${encodeURIComponent(category)}&page=${page}&limit=5`)
    .then(posts=>posts.json())
    .then(data=>{
        const {posts,totalPages,currentPage} = data
        const clone = template.content.cloneNode('true')
        const cardDiv = clone.querySelector('.col-lg-4')
        cardDiv.dataset.category = category
        postCard.setAttribute('data-category',category)

            let PostTitle = clone.querySelector('.card-title')
            PostTitle.textContent = posts[0].title.charAt(0).toUpperCase() + posts[0].title.slice(1)

            // working on the excerpts
            const parser = new DOMParser()
            const postBody = parser.parseFromString(posts[0].body, 'text/html')

            console.log(postBody.body)

            const walker = document.createTreeWalker(postBody.body, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node){
                    return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT
                }
            })

            let node;
            let extractedText = ''

            while((node = walker.nextNode())){
                extractedText += node.nodeValue + ''
            }

           clone.querySelector('.card-text').textContent= `${extractedText.length > 100 ? extractedText.slice(0,200).trim()+'...' : extractedText.trim()}`
            clone.getElementById('post-link').href = `/posts.html?title=${posts[0].title}`
            clone.querySelector('.card-img-top').src= `${posts[0].featuredImage? posts[0].featuredImage : '/images/photo.png'}`
            clone.getElementById('category').textContent = posts[0].category.charAt(0).toUpperCase() + posts[0].category.slice(1)

            const listGroup = clone.getElementById('other-posts')
            posts.slice(1).forEach(posts=>{
                const li = document.createElement('li')
                const img = document.createElement('img')
                img.src = `${posts.image?'/images'+posts.image : '/images/photo.png'}`
                img.alt = 'thumb'
                img.className = 'me-3'
                img.style.width = '40px'
                img.style.height = '40px'
                img.setAttribute('object-fit','cover')
                const listTitle = document.createElement('a')
                li.className = 'list-group-item d-flex align-items-center'
                listTitle.textContent = posts.title.charAt(0).toUpperCase() + posts.title.slice(1)
                listTitle.className= 'fw-semibold text-decoration-none'
                listTitle.href=`/posts.html?title=${posts.title}`
                listGroup.appendChild(li)
                li.appendChild(img)
                li.appendChild(listTitle)

            })

            console.log(totalPages)
            // Pagination
                const PagList = clone.querySelector('.pagination-list')
                for(let i = 1; i <= totalPages; i++){
                    const li = document.createElement('li')
                    li.className = `page-item ${i == currentPage ? 'active':'' }`
                    
                    const btn = document.createElement('button')
                    btn.className = 'page-link'
                    btn.textContent = i
                    btn.disabled = (i == currentPage)
                    btn.addEventListener('click', ()=>{
                        
                        //render new page
                        listPost(category,i)
                    })
                    li.appendChild(btn)
                    PagList.appendChild(li)
                }
                    
            //when a user clicks a page, re-render this category block only
                        //remove the old one if exist
            const existing = postCard.querySelector(`[data-category="${category}"]`)
            console.log(existing)
            if(existing){
            existing.replaceWith(clone)
            }else{
                 postCard.appendChild(clone)
            }

            spinner.style.display = 'none'
           

    }).catch(err=>{
        console.error(`Error fetching post for ${category}:`, err);
        spinner.style.display = 'none';
        if(existing){
            const cardSpinner = existing.querySelector('.card-spinner');
            if(cardSpinner) cardSpinner.style.display = 'none';
        }
    })
    
}

listPost()


// flash message
fetch('/flash')
.then(res => res.json())
.then(data => {
    if(data.message){
        const toastEl =document.getElementById('toast')
        const body = toastEl.querySelector('.toast-body')
console.log(data)
        //reset classes
        toastEl.className = 'toast text-white show'

        //add background colour based on type
        if(data.type == 'success'){
            toastEl.classList.add('bg-success')
        } else if (data.type == 'danger'){
            toastEl.classList.add('bg-danger')
        }else{
            toastEl.classList.add('bg-primary')
        }
        
        body.textContent = data.message;
        new boostrap.Toast(toastEl).show()
    }
}).catch(err=>{
    console.log(err)
})

// search
const searchBtn = document.getElementById('search-btn')
const searchInput = document.querySelector('input[type=search]')

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = `/search.html?search=${encodeURIComponent(searchInput.value)}`
})