const dashboard = document.getElementById('dashboard')
const addUser = document.getElementById('register')
const addPost = document.getElementById('add-post')
const logout = document.getElementById('logout')

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
