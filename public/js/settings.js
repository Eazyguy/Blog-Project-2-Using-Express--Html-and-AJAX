import Tags from '/bootstrap5-tags/tags.js'

//categories
fetch('/api/categories')
.then(res=>res.json())
.then(data=>{
    const category = document.getElementById('category')
    
    const items = data.map(op=> ({
        value: op, label: op.charAt(0).toUpperCase() + op.slice(1), selected:true
    }))

    Tags.init("#category",{
  'items': items,
  'max':5
})
    
})