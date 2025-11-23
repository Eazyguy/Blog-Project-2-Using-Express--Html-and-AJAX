const authenticated = require("../middleware/authenticated")

//@desc check if user is authentcated
//route GET /check-auth
const checkAuth = (req, res)=>{
    res.json({authenticated:!!req.session.userId})
}

module.exports = {checkAuth}