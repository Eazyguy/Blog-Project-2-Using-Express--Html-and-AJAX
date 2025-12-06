import Tags from '/bootstrap5-tags/tags.js'

//categories
fetch('/api/categorySet')
.then(res=>res.json())
.then(data=>{
    const category = document.getElementById('category')

  let items = data.map(op=> ({
        value: op, label: op.charAt(0).toUpperCase() + op.slice(1), selected:true
    }))
  

  console.log(items)
    Tags.init("#category",{
  'items': items,
  'max':5
})
    
})