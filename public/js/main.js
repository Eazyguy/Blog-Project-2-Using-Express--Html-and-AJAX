let postCard = document.getElementById('post-list')
let template = document.getElementById('card-template')
let spinner = document.getElementById('spinner')

//postCard.innerHTML = '' 

fetch('api/categories')
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

    fetch(`http://localhost:3000/api/posts?category=${encodeURIComponent(category)}&page=${page}&limit=5`)
    .then(posts=>posts.json())
    .then(data=>{
        const {posts,totalPages,currentPage} = data

        const clone = template.content.cloneNode('true')
        const cardDiv = clone.querySelector('.col-lg-4')
        cardDiv.dataset.category = category
        postCard.setAttribute('data-category',category)

            let PostTitle = clone.querySelector('.card-title')
            PostTitle.textContent = posts[0].title.charAt(0).toUpperCase() + posts[0].title.slice(1)
            clone.querySelector('.card-text').textContent= `${posts[0].body.length > 100 ? posts[0].body.slice(0,200)+'...' : posts[0].body}`
            clone.getElementById('post-link').href = `/${posts[0].title}`
            clone.querySelector('.card-img-top').src= `${posts[0].image?'/images'+posts[0].image : '/images/photo.png'}`
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
                listTitle.href=`/${posts.title}`
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