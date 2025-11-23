const toastContainer = document.querySelector('.toast-container')

fetch('/flash')
.then(res => res.json())
.then(data => {
    
    const messages = data?.message || []
    const showToast = (msg) =>{
        const toastEl = document.createElement('div')
        toastEl.className = 'toast text-white show'
        toastEl.setAttribute('role','alert')
        toastEl.setAttribute('aria-atomic','true')

        const body = document.createElement('div')
        body.className = 'toast-body'
        body.textContent = typeof msg === 'string'?msg:msg.msg
        toastEl.appendChild(body)

        //add background color
        const type = data.type ||msg.type || 'primary'
        toastEl.classList.add(`bg-${type}`)

        toastContainer.appendChild(toastEl)
        new bootstrap.Toast(toastEl).show()
    }

    if(typeof messages === 'string'){
        showToast(messages)
    }else if(Array.isArray(messages)){
        messages.forEach(showToast)
    }
    //Append Container once
    // if(!document.body.contains(toastContainer)){
    //     document.body.appendChild(toastContainer)
    // }
}).catch(err => console.error(err))
