const {login, register} = require('../controllers/authController')

const express = require('express')

const authrouter = express.Router()


authrouter.post('/login', login)
authrouter.post('/register', register)


module.exports = {authrouter}

