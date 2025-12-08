const Delta = Quill.import('delta')

const quill = new Quill('#editor',{
    theme:'snow',
    modules:{
        toolbar: {
        container:[
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{'header':1},{'header':2}],
            [{'list':'ordered'},{'list':'bullet'}],
            [{'script':'sub'},{'script':'super'}],
            [{'indent':'-1'},{'indent':'+1'}],
            [{'direction':'rtl'}], [{'size':['small',false,'large','huge']}],
            [{'header':[1,2,3,4,5,6,false]}], [{'color':[]}, {'background':[]}],
            [{'font':[]}], [{'align':[]}], ['link','image', 'video'],['clean']
        ],
        
         handlers:{
          image: ()=>{
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.setAttribute('name','image')
            input.click()

            input.onchange = () => {
              const file = input.files[0] 
              uploadImage(file)
             
            }
        }
          }
        }, 
        clipboard:{
          matchers:[
            ['IMG', (node, delta)=> new Delta()]
          ]
        }, 
        // cardEditable: true 
    }
})

quill.clipboard.addMatcher('IMG', (node, delta) => new Delta())

const postForm = document.getElementById('post-form')
if (postForm) {
  postForm.onsubmit = () => {
    const html = quill.root.innerHTML || ''
    const bodyInput = document.getElementById('body')
    if (bodyInput) bodyInput.value = html
    // allow submit to continue
    return true
  }
} else {
  console.warn('post-form not found: form submit handler not attached')
}



const uploadedImages = []; // { id, file }
let imageId = 0;


function insertTempImage(file) {
  const reader = new FileReader();
  const id = 'temp-img-' + imageId++;
  
  reader.onload = () => {
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'image', reader.result);
    uploadedImages.push({ id, file, base64: reader.result });
  };
  
  reader.readAsDataURL(file);
}

quill.root.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items || [];
  for (let item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault();
      insertTempImage(item.getAsFile());
    }
  }
}, true);

quill.root.addEventListener('drop', (e) => {[12/8, 22:50] const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'));
  if (files.length) {
    e.preventDefault();
    files.forEach(file => insertTempImage(file));
  }
}, true);

async function uploadImages() {
  for (let { base64, file } of uploadedImages) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/upload', { method: 'POST', body: formData });
    const data = await res.json();

    const delta = quill.getContents();
    delta.ops.forEach(op => {
      if (op.insert?.image === base64) {
        op.insert.image = data.url;
      }
    });

    quill.setContents(delta);
  }

  // Now the editor content is clean, submit it
  const html = quill.root.innerHTML;
  // Send html via fetch or form
}

/*const editor = document.querySelector('#editor')

editor.addEventListener('click', ()=>{
  quill.focus()
})

quill.root.addEventListener('paste', (e) => {
  const items = (e.clipboardData && e.clipboardData.items) || []

  let handledImage = false

  for (let item of items) {
    if (item.type && item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) uploadImage(file)
      handledImage = true
    }
  }

  if (handledImage) {
    e.stopImmediatePropagation()
    e.preventDefault()
  }
}, true)

// handle drop BEFORE Quill internal drop handling (capture = true)

quill.root.addEventListener('paste', (e) => {
  const items = (e.clipboardData && e.clipboardData.items) || []

  let handledImage = false

  for (let item of items) {
    if (item.type && item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) uploadImage(file)
      handledImage = true
    }
  }

  if (handledImage) {
    e.stopImmediatePropagation()
    e.preventDefault()
  }
}, true)

quill.root.addEventListener('drop', (e) => {
  const files = e.dataTransfer?.files || []

  const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))

  if (imageFiles.length > 0) {
    e.stopImmediatePropagation()
    e.preventDefault()

    imageFiles.forEach(uploadImage)
  }
 }, true)

function uploadImage(file){
  const formData = new FormData()
  formData.append('image', file)
  for (let pair of formData.entries()){
         console.log(`${pair[0]}:`, pair[1])
  }
 
  
  fetch('/upload',{
    method:'POST',
    body:formData
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    const range = quill.getSelection(true)
    const index = range ? (range.index + (range.length || 0)) : quill.getLength()
    quill.insertEmbed(index, 'figure', { src: data.url, alt: '', caption: '' })
    quill.setSelection(index + 1)
  })
}*/

// UI + handlers for editing figure blot (works with FigureBlot)
;(function(){
  const main = document.querySelector('main')
  const tpl = document.getElementById('floating-editor')
  if (!tpl || !tpl.content) {
    console.error('floating-editor template not found — image meta UI disabled')
    return
  }

  // clone template and attach panel to DOM
  const frag = tpl.content.cloneNode(true)
  main.appendChild(frag)
  const panel = main.querySelector('.img-meta-panel')
  if (!panel) {
    console.error('.img-meta-panel missing inside template — image meta UI disabled')
    return
  }

  // create badge button (reuse your CSS / bootstrap)
  const badge = document.createElement('button')
  badge.type = 'button'
  badge.className = 'btn btn-sm btn-primary img-edit-badge'
  badge.textContent = 'Edit'
  badge.style.position = 'absolute'
  badge.style.display = 'none'
  badge.style.zIndex = '1050'
  document.body.appendChild(badge)

  let currentFigure = null

  function place(el, rect, offsetX = 0, offsetY = 0){
    el.style.left = (window.scrollX + rect.left + offsetX) + 'px'
    el.style.top = (window.scrollY + rect.top + offsetY) + 'px'
  }

  function findFigure(target){
    if (!target) return null
    // prefer nearest figure blot
    const fig = target.closest && target.closest('figure.ql-card-figure')
    if (fig) return fig
    // if clicked image inside non-figure, return its parent figure if exists
    if (target.tagName === 'IMG') return target.closest('figure')
    return null
  }

  function showBadgeForFigure(fig){
    if (!fig) return
    const r = fig.getBoundingClientRect()
    // position badge so its RIGHT edge sits at the figure's right (small inset)
    const rightEdge = window.scrollX + r.right - 6
    const top = window.scrollY + r.top + 6
    badge.style.left = rightEdge + 'px'
    badge.style.top = top + 'px'
    // shift badge left by its full width so its right edge aligns with rightEdge
    badge.style.transform = 'translateX(-100%)'
    badge.style.display = 'block'
    badge._figure = fig
  }

  function hideBadge(){
    badge.style.display = 'none'
    badge._figure = null
  }

  function openPanelForFigure(fig){
    currentFigure = fig
    const img = fig.querySelector('img')
    const cap = fig.querySelector('figcaption')
    const r = fig.getBoundingClientRect()
    place(panel, r, 0, r.height + 8)
    panel.style.display = 'block'
    panel.querySelector('input[name="alt"]').value = img ? (img.getAttribute('alt') || '') : ''
    panel.querySelector('input[name="title"]').value = img ? (img.getAttribute('title') || '') : ''
    panel.querySelector('textarea[name="caption"]').value = cap ? cap.textContent : ''
  }

  function closePanel(){
    panel.style.display = 'none'
    currentFigure = null
  }

  function saveMeta(){
    if (!currentFigure) return
    const alt = panel.querySelector('input[name="alt"]').value.trim()
    const title = panel.querySelector('input[name="title"]').value.trim()
    const caption = panel.querySelector('textarea[name="caption"]').value.trim()

    const img = currentFigure.querySelector('img')
    if (img) {
      if (alt) {img.setAttribute('alt', alt)} else {img.removeAttribute('alt')}
      if (title) {img.setAttribute('title', title) }else {img.removeAttribute('title')}
    }

    let figcap = currentFigure.querySelector('figcaption')
    if (caption) {
      if (!figcap) {
        figcap = document.createElement('figcaption')
        figcap.className = 'ql-image-caption'
        currentFigure.appendChild(figcap)
      }
      figcap.textContent = caption
    } else {
      if (figcap) figcap.remove()
    }

    // mark editor as changed so server receives updated HTML on submit (Quill still holds DOM)
    // You can optionally trigger a selection/change to force Quill to notice:
    const range = quill.getSelection()
    if (range) quill.setSelection(range.index, range.length)

    closePanel()
  }

  // Delegated events on quill.root — work with figure or image
  quill.root.addEventListener('mouseover', (e) => {
    const fig = findFigure(e.target)
    if (fig) showBadgeForFigure(fig)
  })
  quill.root.addEventListener('mouseout', (e) => {
    const related = e.relatedTarget
    if (!related || (related !== badge && !panel.contains(related))) hideBadge()
  })

  badge.addEventListener('click', () => {
    if (badge._figure) openPanelForFigure(badge._figure)
  })

  quill.root.addEventListener('click', (e) => {
    const fig = findFigure(e.target)
    if (fig) openPanelForFigure(fig)
    else if (!panel.contains(e.target) && e.target !== badge) closePanel()
  })

  panel.addEventListener('click', (e) => {
    const action = e.target.getAttribute && e.target.getAttribute('data-action')
    if (action === 'save') saveMeta()
    if (action === 'close') closePanel()
  })

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel() })

  // expose for backward compatibility (noop)
  window.__quillAttachImageHandlers = () => {}
})()