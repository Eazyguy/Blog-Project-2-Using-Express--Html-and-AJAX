let postCard = document.getElementById('post-list')
let template = document.getElementById('card-template')
postCard.innerHTML = '' 


let listPost =()=>{
    fetch('http://localhost:3000/api/posts')
    .then(posts=>posts.json())
    .then(data=>{
        
        function groupByCategory(data){
            return data.reduce((acc, post)=>{
                if(!acc[post.category]) acc[post.category] = []
                acc[post.category].push(post)
                return acc
            },{})
        }

        const grouped = groupByCategory(data)

        Object.entries(grouped).forEach(([category,posts])=>{
        const clone = template.content.cloneNode('true')
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
            postCard.appendChild(clone)

        })



        //    
        //  
        //    
        //    
        //    
        //    postCard.appendChild(clone)

        //data.forEach(posts => {
          
        //     const clone = template.content.cloneNode('true')

        //    let PostTitle = clone.querySelector('.card-title')
        //    PostTitle.textContent = posts.title.charAt(0).toUpperCase() + posts.title.slice(1)
        //    clone.querySelector('.card-text').textContent= `${posts.body.length > 100 ? posts.body.slice(0,200)+'...' : posts.body}`
        //    
        //    clone.querySelector('.card-img-top').src= `${posts.image?'/images'+posts.image : '/images/photo.png'}`
        //    
        //});
    })
}



listPost()