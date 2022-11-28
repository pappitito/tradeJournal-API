const express = require('express')
const User = require('../model/userModel')
const {StatusCodes} = require('http-status-codes')

async function register(req,res){
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'please input complete feild input'})

    }
    if(password.length < 5){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'password should be longer than five characters'})
    }

    try {
        const user = await User.create(req.body)
        const token = await user.createToken()
        return res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
    } catch (error) {
        
        if(error.code === 11000){
            return res.status(StatusCodes.BAD_REQUEST).json({msg: 'email already in use'})
        }
        return res.status(StatusCodes.BAD_REQUEST).json({msg: error})
        
    }


}

async function login(req,res){
    const {email, password} = req.body
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'please input email and password'})
    }
    const user = await User.findOne({email: email})
    
    if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Invalid user'})
    }
    const passwordCorrect = await user.checkPassword(password)
    if(!passwordCorrect){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'Invalid useranme or password'})
    }
    const token = await user.createToken()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {login, register} 
