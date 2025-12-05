// Profile Image Preview
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

//get user data
fetch('/check-user')
.then(res => res.json())
.then(data => {
    const {profileImage, username, firstname, surname, email} = data
    if(profileImage){
    const profilePreview = document.createElement('img')
    profilePreview.src = profileImage
    profilePreview.alt = 'preview'
    profilePreview.title = 'preview'
    profilePreview.className = 'img-fluid'
    console.log(profilePreview)
    document.querySelector('.image-preview').appendChild(profilePreview)
                }
   document.getElementById('username').value = username
   document.getElementById('firstname').value = firstname
   document.getElementById('surname').value = surname
   document.getElementById('email').value = email
        
})