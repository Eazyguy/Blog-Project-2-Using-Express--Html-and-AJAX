const dashboard = document.getElementById('dashboard')
const addUser = document.getElementById('register')
const addPost = document.getElementById('add-post')
const logout = document.getElementById('logout')
const profile = document.getElementById('profile')
const editProfile = document.getElementById('edit-profile')

// dashboard.style.display = 'none'
// addUser.style.display = 'none'
// addPost.style.display = 'none'
//logout.style.display = 'none'
// profile.style.display = 'none'
// if(editProfile) editProfile.style.display = 'none'


function checkAuth(element){
    fetch('/check-auth')
    .then(res=>res.json())
    .then(auth=>{
        if(auth.authenticated){
            element.style.display = 'block'
        }
    })
}

checkAuth(addPost)
checkAuth(logout)
checkAuth(profile)
// checkAuth(editProfile)

//Hiding page navigation item on the current page
//home
const home = document.getElementById('home')
if(window.location.pathname === '/'){
    home.style.display = 'none'
}

 //dashboard
 if(window.location.pathname === '/secure/dashboard.html'){
    dashboard.style.display = 'none'
}else{
    checkAuth(dashboard)
}

//Add user
 if(window.location.pathname === '/secure/register.html'){
    addUser.style.display = 'none'
}else{
    checkAuth(addUser)
}

//profile on nav
fetch('/check-user')
.then(res=>res.json())
.then(data => {
    const {username, profileImage} = data
    document.getElementById('nav-username').textContent = username
    const avatar = document.querySelector('img[alt="avatar"]')
    avatar.src = `${profileImage?profileImage:'/images/blank-profile-picture.png'}`

    const imgProfile = document.querySelector('img[alt="img-profile"]')
    imgProfile.src = `${profileImage?profileImage:'/images/blank-profile-picture.png'}`
})