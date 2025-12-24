let mongoose = require('mongoose')
let User = require('../models/UserSocial')
let express = require('express')
let router = express.Router()
let bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
let cloudinary = require('../config/cloudinary');
router.post('/signup', async(req, resp)=>{
    try{
        let{userName, email, password, image} = req.body
        if(!userName|| !email|| !password){
            return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
        }
        let oldUser =await User.findOne({email})
        if(oldUser){
            return resp.status(401).json({status:'fail', data:'User already exit, Thanks to signin'})
        }
        let hashedPAssword = await bcryptjs.hash(password,8)
        let imageUrl=null
        if(image){
            let uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        let user = new User({
            userName, email,
            password:hashedPAssword,
            image:imageUrl
        })
        let token = jwt.sign({id:user._id,email,userName},process.env.SECRET_KEY)
        await user.save()
        resp.cookie('jwtCookies', token, {
                maxAge:7*24*60*60*1000,//node handle with millescond
                httpOnly:true, // to prevent attack and more secure
                sameSite:'lax', // to prevent attack and more secure
                secure:false,
            });
        resp.status(200).json({status:'success', data:{user, token}})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error})
    }
})

router.post('/signin', async(req, resp)=>{
    try{
        let {email, password} = req.body
        if(!email ||!password){
            return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
        }
        let user = await User.findOne({email})
        if(!user){
            return resp.status(401).json({status:'fail', data:'User not exit, Thanks to signup'})
        }
        let hashedPassword = await bcryptjs.compare(password,user.password)
        if(!hashedPassword){
            return resp.status(402).json({status:'fail', data:'Password not correct'})
        }
        let token = jwt.sign({id:user._id,email,userName:user.userName},process.env.SECRET_KEY)
        resp.cookie('jwtCookies', token,{
            maxAge:7*24*60*60*1000,//node handle with millescond
            httpOnly:true, // to prevent attack and more secure
            sameSite:'lax', // to prevent attack and more secure
            secure:false,
        })
        resp.status(200).json({status:'success', data:{user, token}})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error})
    }
})

router.get('/me', async (req, resp) => {
  try {
    const token = req.cookies.jwtCookies;
    if (!token) return resp.status(401).json({ status: 'fail', data: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return resp.status(401).json({ status: 'fail', data: 'User not found' });

    resp.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    resp.status(500).json({ status: 'error', data: error.message });
  }
});

router.delete('/logout', async(req, resp)=>{
    try{
        resp.cookie('jwtCookies','',{
            maxAge:0,
            httpOnly:true, // to prevent attack and more secure
            sameSite:'lax', // to prevent attack and more secure
            secure:false,
        })
        resp.status(200).json({status:'success', data:"Cookie removed succefully"})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error})
    }
})

module.exports = router