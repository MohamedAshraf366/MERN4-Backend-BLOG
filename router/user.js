let express = require('express')
let router = express.Router()
let bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
let User = require('../models/UserSchema')
const {auth} = require('../auth/middleware')
let {cookieAuth} = require('../auth/middleware')

//1- for registeration
router.post('/register', async(req, resp)=>{
    try{
        let{name,email, password} = req.body
        if(!name || !email || !password){
            return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
        }
        let oldEmail = await User.findOne({email})
        if(oldEmail){
            return resp.status(404).json({status:'fail', data:'User Already Exit'})
        }
        let hashedPassword = await bcryptjs.hash(password,8)
        let user = new User({name, email, password:hashedPassword, role:'user'})
        let token = jwt.sign({email, id:user._id, role:user.role}, process.env.SECRET_KEY)
        await user.save()
        // t save token in cookies
        resp.cookie('token', token,{
            httpOnly:true,
            secure: false,
            sameSite: 'none', // دي كمان أفضل تضيفها عشان تحمي من CSRF
            // maxAge: 24 * 60 * 60 * 1000 // مدة صلاحية الكوكيز: يوم كامل
        })
        let role = user.role || 'user'
        resp.status(200).json({status:'success', data:{user, token, role}})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error})
    }
})

//2- for signin
router.post('/signin', async(req, resp)=>{
    let{email, password} = req.body
    if(!email || !password ){
        return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
    }
    let user = await User.findOne({email})
    if(!user){
        return resp.status(404).json({status:'fail', data:'User not exist'})
    }
    let hashedPAssword = await bcryptjs.compare(password, user.password)
    if(!hashedPAssword)
    {
        return resp.status(405).json({status:'fail', data:'Password not correct'})
    }
    let role = user.role || 'user'
    let token = jwt.sign({email, id:user._id, role:user.role}, process.env.SECRET_KEY)
    resp.cookie('token', token,{
            httpOnly:true,
            secure: false,
            sameSite: 'none',
            // maxAge: 24 * 60 * 60 * 1000 // مدة صلاحية الكوكيز: يوم كامل
        })

    let redirectPath = role === 'admin' ? '/admin' : '/'
    resp.status(200).json({status:'success', data:{user, token,role, redirect:redirectPath}})
})
// make router /me to use in admin auth to protect the admin dashbord
router.get('/verifyAdmin', cookieAuth(), async(req, resp)=>{
    try{
    let user = await User.findById(req.user.id).select('-password')
    if(!user){
        return resp.status(400).json({status:'fail', data:'User not exist'})
    }
    resp.status(200).json({status:'success', data:{
        id:user._id,
        name:user.name,
        email: user.email,
        role:user.role
    }})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error})
    }
})


router.delete('/logout',(req, resp)=>{
    resp.clearCookie('token',{
        httpOnly:true,
        secure: false,
        sameSite: 'none', // دي كمان أفضل تضيفها عشان تحمي من CSRF
    })
    resp.status(200).json({status:'success', data:"Cookie removed succefully"})
})
//use auth to protect that only admin can bring all users data
router.get('/:id',auth('admin'), async(req, resp)=>{
    let {id} = req.params
    let user = await User.findById(id)
    if(!user){
        return resp.status(404).json({status:'fail', data:'User not exist'})
    }
    resp.status(200).json({status:'success', data:user})
})

module.exports = router
