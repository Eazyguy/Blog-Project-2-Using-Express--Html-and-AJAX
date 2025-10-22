const toastContainer = document.querySelector('.toast-container')

fetch('/flash')
.then(res => res.json())
.then(data => {
   const message = data.message
    message.forEach(message => {

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
    
}).catch(err=>(console.error(err)))