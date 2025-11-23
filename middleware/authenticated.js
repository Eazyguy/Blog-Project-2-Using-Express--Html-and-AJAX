
module.exports = (req, res, next) =>{
   if(req.session && req.session.userId){
    return next()
}
req.session.message = {
            type:'danger',
            message:'Access denied, Please login first'
        }
res.status(401).json()
}