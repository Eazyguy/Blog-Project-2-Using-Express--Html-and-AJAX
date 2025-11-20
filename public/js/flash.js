const toastContainer = document.createElement('div')
toastContainer.classList='toast-container position-fixed top-2 p-3'

fetch('/flash')
.then(res => res.json())
.then(data => {
    
   const messages = (data && data.message) || []
   if(typeof(messages) == 'string'){
    const toastEl = document.createElement('div')
        toastEl.className = 'toast text-white'
        toastEl.setAttribute('role','alert')
        toastEl.setAttribute('aria-live','assertive')
        toastEl.setAttribute('aria-atomic','true')

        const body = document.createElement('div')
        body.className='toast-body'

        body.textContent = messages

        toastEl.appendChild(body)

        
        if(messages){
        
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
        
        console.log(toastContainer)
       // body.textContent = message.msg;
       toastContainer.appendChild(toastEl)
       new bootstrap.Toast(toastEl).show()
       console.log( new bootstrap.Toast(toastEl).show())
       document.body.appendChild(toastContainer)
        
    }
   }else{
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
       document.body.appendChild(toastContainer)
        new bootstrap.Toast(toastEl).show()
    }
    });

   }
   }).catch(err => console.error(err))
