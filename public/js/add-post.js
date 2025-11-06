const toastContainer = document.querySelector('.toast-container')

fetch('/flash')
.then(res => res.json())
.then(data => {
   const messages = (data && data.message) || []
   messages.forEach(message => {

        const toastEl = document.createElement('div')
        toastEl.className = 'toast text-white'
        toastEl.setAttribute('role','alert')
        toastEl.setAttribute('aria-live','assertive')
        toastEl.setAttribute('aria-atomic','true')

        const body = document.createElement('div')
        body.className='toast-body'

        body.textContent = message.msg

        toastEl.appendChild(body)

        console.log(toastContainer)

        if(message){
        // const toastEl =document.getElementById('toast')
        // const body = toastEl.querySelector('.toast-body')

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
        
       // body.textContent = message.msg;
       toastContainer.appendChild(toastEl)
        new bootstrap.Toast(toastEl).show()
    }
    });
}).catch(err => console.error(err))

// Featured Image
const imgContainer = document.querySelector('.image-preview')
const fileInput = document.getElementById('preview')

fileInput.addEventListener('change', (e)=>{
    const file = e.target.files[0]
    
    if(file){
        const reader = new FileReader()
        reader.onload = (e)=>{
            const img = document.createElement('img')
            img.src = e.target.result;
            img.style.maxWidth = '250px';
            img.style.maxHeight = '250px'

            imgContainer.innerHTML = '';
            imgContainer.appendChild(img)
        }
        reader.readAsDataURL(file)
    }
})