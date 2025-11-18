const template = document.getElementById('search-template')
const main = document.querySelector("#result-list")
const totalResult = document.getElementById('total-result')


const params = new URLSearchParams(window.location.search)
const query = params.get('search')
const page = params.get('page')

console.log(query)

fetch(`/api/search?search=${query}&&page=${page || 1 }`)
.then(res => res.json())
.then(data => {
    const {result, totalPages, currentPage} = data

totalResult.textContent = result.length == 0 ? 'No results found' : `Total results found: ${result.length.toString()}`

    result.forEach(res => {
        const clone = template.content.cloneNode(true)
        
        //thumbnail
    const img = clone.querySelector('.card-img-top')
    img.src = res.featuredImage?res.featuredImage:'/images/photo.png'

    //title
    clone.querySelector('.card-title').textContent = res.title

    // working on the excerpts
            const parser = new DOMParser()
            const postBody = parser.parseFromString(res.body, 'text/html')

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

           //Read more link
           clone.getElementById('post-link').href = `/posts.html?title=${res.title}`
    
    //append to body
    main.appendChild(clone)

    });
    
// pagination
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
pglink.href=`/search.html?search=${query}&&page=${i}`
if (i == currentPage) {
    pglink.removeAttribute('href')
    pglink.style.pointerEvents = 'none'
    pglink.addEventListener('click',e=> e.preventDefault())  
}

li.appendChild(pglink)
pagination.appendChild(li)
paginationContainer.appendChild(pagination)

}
    
})

// search
const searchBtn = document.getElementById('search-btn')
const searchInput = document.querySelector('input[type=search]')

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = `/search.html?search=${encodeURIComponent(searchInput.value)}`
})