const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')
require('dotenv')

const auth = async (req,res,next) =>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized access denied")
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload =  jwt.verify(token, process.env.secret_key)
        req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized access denied")
    }
}

module.exports = auth