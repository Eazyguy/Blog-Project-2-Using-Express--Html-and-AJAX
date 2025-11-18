const{check, validationResult} = require('express-validator')
const bcrypt = require('')
let User = require('../models/user')

const addUser = (req, res) => {
    const user = new User()
    user.firstname = req.body.name
    user.lastname = req.body.lastname
          
}