let express = require('express')
let router = express.Router()
let Post = require('../models/PostSchema')
let auth = require('./auth/middleware')
router.post('/addPost',auth() ,async(req, resp)=>{
    try{
        let {title, body} = req.body
        if(!title || !body){
            return resp.status(400).json({status:'fail', data:"Thanks to fill all required data"})
        }

        let post = new Post({title, body, createdBy:req.user.id})
        await post.save()
        resp.status(200).json({status:'success', data:post})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

router.get('/allPost', async(req, resp) =>{
    try{
        let post = await Post.find().populate('createdBy')
        if(!post){
            return resp.status(400).json({status:'fail', data:"Np post exit"})
        }
        resp.status(200).json({status:'success', data:post})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})
router.get('/myPost',auth(), async(req, resp) =>{
    try{
        let post = await Post.find({createdBy:req.user.id}).populate('createdBy')
        if(!post){
            return resp.status(400).json({status:'fail', data:"No Post exit"})
        }
        resp.status(200).json({status:'success', data:post})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

router.post('/search', async(req, resp)=>{
    try{
        let searrchTerm = req.body.searchTerm ||''
        let result = await Post.find({
            $or:[
                {title:{$regex:searrchTerm, $options:'i'}},
                {body:{$regex:searrchTerm, $options:'i'}},
            ]
        })
        if(result.length >0){
            resp.status(200).json({status:'success', data:result})
        }
        else{
            resp.status(400).json({status:'success', data:'Item not found'})
        }
        
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

router.get('/:id', async(req, resp)=>{
    try{
        let {id} = req.params
        let post = await Post.findById(id).populate('createdBy')
        if(!post){
            return resp.status(400).json({status:'fail', data:"Post Already exit"})
        }
        resp.status(200).json({status:'success', data:post})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }  
})
router.patch('/modifyPost/:id', async(req, resp)=>{
    try{
        let {id} = req.params
        let post = await Post.findByIdAndUpdate(id, req.body,{
            new:true,
            runValidators:true
        })
        if(!post){
            return resp.status(400).json({status:'fail', data:"Post Already exit"})
        }
        resp.status(200).json({status:'success', data:post})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }  
})

router.delete('/deletePost/:id', async(req, resp)=>{
    try{
        let {id}= req.params
        let post = await Post.findByIdAndDelete(id)
        if(!post){
            return resp.status(400).json({status:'fail', data:"Post Already exit"})
        }
        resp.status(200).json({status:'success', data:'Post Deleted Succeffuly'})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    } 
})

module.exports = router