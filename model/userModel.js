const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please input name']
    },
    password: {
        type: String,
        required: [true, 'please input password'],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, 'please input password'],
        match:[
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'
        ],
        unique: true


    }
},)

userSchema.pre('save',async function(){
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function(userpassword){

    try {
        const isMatch = await bcryptjs.compare(userpassword, this.password)
        return isMatch
    } catch (error) {
        console.log(error)
        
    }

}

userSchema.methods.createToken = async function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.secret_key, {expiresIn: process.env.expiry} )
    

}

module.exports = mongoose.model('User', userSchema)

