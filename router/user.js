let express = require('express')
let router = express.Router()
let bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
let User = require('../models/userSchema')

//1- for registeration
router.post('/register', async(req, resp)=>{
    let{name,email,password, role='user'} = req.body
    if(!name || !email || !password){
        return resp.status(404).json({status:'fail', data:"All field are required"})
    }
    let oldUser = await User.findOne({email})
    if(oldUser){
        return resp.status(405).json({status:'fail', data:"User alradey exist"})
    }
    let hashedPassword = await bcryptjs.hash(password, 8)
    let user = new User({name, email, password:hashedPassword, role})
    let token = jwt.sign({id:user._id, email, role:user.role}, process.env.SECRET_KEY)
    await user.save()
    resp.status(200).json({status:'success', data:{user, token}})
})
router.post('/login', async(req, resp)=>{
    let{email,password} = req.body
    if(!email || !password){
        return resp.status(400).json({status:'fail', data:"All field are required"})
    }
    let user = await User.findOne({email})
    if(!user){
        return resp.status(404).json({status:'fail', data:"Email not valid, Thanks to register Now"})
    }
    let comparedPassword = await bcryptjs.compare(password, user.password)
    if(!comparedPassword){
        return resp.status(405).json({status:'fail', data:"Password not correct"})
    }
    let token = jwt.sign({id:user._id, email, role:user.role}, process.env.SECRET_KEY)
    
    resp.status(200).json({status:'success', data:{user, token}})
})

module.exports = router
