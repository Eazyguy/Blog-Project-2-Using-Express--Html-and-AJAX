
//@desc Takes the user to either the login or dashboard page
//route redirect to dashboard
const admin = (req, res)=>{
    res.redirect('/secure/dashboard.html')
}

module.exports = {admin}