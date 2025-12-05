let postCard = document.getElementById('post-list')
let template = document.getElementById('card-template')
let spinner = document.getElementById('spinner')
let featuredCon = document.getElementById('featured-list')
let featuredTemplate = document.getElementById('slide-template')


fetch('/api/categories')
.then(res => res.json())
.then(categories =>{
    categories.forEach(cat => {
        listPost(cat,1)
    });

    categories.slice(0,2).forEach(cat=>{
        featuredList(cat)
    })
})

let featuredList = (category) =>{
    fetch(`/api/posts/featured?category=${category}`)
    .then(res=>res.json())
    .then(post=>{

        if(post && post.length > 0){
        
        const clone = featuredTemplate.content.cloneNode(true)
        const featuredDiv = document.createElement('div')
        featuredDiv.className = 'col-12 col-md-6 col-lg-6 mb-1 p-1'
        const slideInner = clone.querySelector('.carousel-inner')
        const postSlide = clone.getElementById('post-Slide')

        post.forEach(feat=>{

        let slideImageCon = document.createElement('div')
        console.log(post.indexOf(feat))
        slideImageCon.className = `carousel-item ${post.indexOf(feat) == 0? 'active':''}`
        let slideImage = document.createElement('img')
        slideImage.className= 'd-block w-100 feat-img'
        slideImage.src = `${feat.featuredImage?feat.featuredImage : '/images/photo.png'}`
        slideImageCon.appendChild(slideImage)
        slideInner.appendChild(slideImageCon)
        
        })

        console.log(featuredCon)
        featuredDiv.appendChild(clone)
        featuredCon.appendChild(featuredDiv)
        
        }
    })
}

featuredList()

let listPost =(category,page)=>{

 spinner.style.display = 'block'
 const existing = postCard.querySelector(`[data-category="${category}"]`)
 
    if(existing){
        // Show spinner in this card
        const cardSpinner = existing.querySelector('#card-spinner')
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
                img.src = `${posts.featuredImage?posts.featuredImage : '/images/photo.png'}`
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



