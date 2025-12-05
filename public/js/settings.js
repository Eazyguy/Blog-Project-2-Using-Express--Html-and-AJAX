import Tags from '/bootstrap5-tags/tags.js'

//categories
fetch('/api/categorySet')
.then(res=>res.json())
.then(data=>{
    const category = document.getElementById('category')

    const defaultCat = [
    {
        "value": "education",
        "label": "Education",
        "selected": true
    },
    {
        "value": "health",
        "label": "Health",
        "selected": true
    },
    {
        "value": "sports",
        "label": "Sports",
        "selected": true
    },
    {
        "value": "technology",
        "label": "Technology",
        "selected": true
    }
]

    let items = []

    if(!data && data.length < 1  ){
    
   items = defaultCat
  }else{
    items = data.map(op=> ({
        value: op, label: op.charAt(0).toUpperCase() + op.slice(1), selected:true
    }))
  }

  console.log(items)
    Tags.init("#category",{
  'items': items,
  'max':5
})
    
})