
categoryMenu = document.getElementById('category-menu')

fetch('/api/categories')
.then(res=>res.json())
.then(data=>{

    let menu = []
    let defaultMenu = [
    "education",
    "health",
    "sports",
    "technology"
]

    if(!data && data.length < 1){
    menu = defaultMenu
    }else{
        menu = data
    
}

       menu.forEach(cat => {
        let menuItem = document.createElement('li')
        const menuLink = document.createElement('a')
        menuLink.className = 'dropdown-item text-capitalize'
        menuLink.textContent = cat
        menuLink.href = `/category.html?category=${cat}`

        menuItem.appendChild(menuLink)
        categoryMenu.appendChild(menuItem)

        
    });

})


// search
const searchBtn = document.getElementById('search-btn')
const searchInput = document.querySelector('input[type=search]')

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href = `/search.html?search=${encodeURIComponent(searchInput.value)}`
})