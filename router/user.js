let mongoose = require('mongoose')
let express = require('express')
let router = express.Router()
let bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
let User = require('../models/UserBlogSchema')

router.post('/register', async(req, resp)=>{
    try{
        let {name, email, password, role='user'} = req.body
        if(!name || !email || !password){
            return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
        }
        let oldUser =await User.findOne({email})
        if(oldUser){
            return resp.status(402).json({status:'fail', data:'User already exist'})
        }
        let hashedPassword = await bcryptjs.hash(password,8)
        let user = new User({email, name, password:hashedPassword, role})
        let token = jwt.sign({id:user._id, email,name:user.name, role:user.role}, process.env.SECRET_KEY)
        await user.save()
        resp.status(200).json({status:'success', data:{user, token}})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error.message})
    }
})

router.post('/signin', async(req, resp)=>{
    try{
        let{email, password} = req.body
        if(!email || !password){
            return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
        }
        let user = await User.findOne({email})
        if(!user){
            return resp.status(402).json({status:'fail', data:'User not found'})
        }
        let hashedPasword = await bcryptjs.compare(password, user.password)
        if(!hashedPasword){
            return resp.status(403).json({status:'fail', data:'User already exist'})
        }
        let token = jwt.sign({id:user._id, email, role:user.role,name:user.name}, process.env.SECRET_KEY)
        resp.status(200).json({status:'success', data:{user, token}})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error.message})
    }
})

module.exports = router