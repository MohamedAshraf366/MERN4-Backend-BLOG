const mongoose = require('mongoose')
const Post = require('../models/postSocial')
const express = require('express')
const router = express.Router()
const auth = require('./auth/middleware')
//to write anew post
router.post('/writePost', auth,async(req, resp)=>{
    const{postContent, postImage} = req.body
    const userId = req.user._id
    if(!userId){
        return resp.status(400).json({status:'fail', data:'user Not logged in'})
    }
    if(!postContent && !postImage){
        return resp.status(401).json({status:'fail', data:"Post can't be empty, thansk to enter text or image to post"})
    }
    const post = new Post({
        userId, postContent, postImage
    })
    await post.save()
    resp.status(200).json({status:'success', data:post})   
})
//to get all posts
router.get('/allPosts',async(req,resp)=>{
    const post = await Post.find().populate('userId').populate('comment.userId')
    if(!post){
        return resp.status(400).json({status:'fail', data:'No post'})
    }
    resp.status(200).json({status:'success', data:post})  
})
//to write comment
router.patch('/writeComment/:postId', auth,async(req, resp)=>{
    const{postId} = req.params
    const userId = req.user._id
    const{commentText, commentImage, createdAt} = req.body
    if (!userId) {
        return resp.status(400).json({ status: 'fail', data: 'user Not logged in' });
    }
    if (!commentImage && !commentText) {
        return resp.status(400).json({ status: 'fail', data: 'image or text are required' });
    }

    const post = await Post.findById(postId)
    if(!post){
        return resp.status(400).json({status:'fail', data:'No post'})
    }

    post.comment.push({
        userId, commentText, commentImage, createdAt:createdAt||Date.now()
    })
    await post.save()
    const populatedPost = await Post.findById(postId).populate('userId').populate('comment.userId')
    resp.status(200).json({status:'success', data:{populatedPost}})   
})

//to get post for specifc usser
router.get('/userProfile', auth,async(req, resp)=>{
    const userId = req.user._id
    const post = await Post.find({userId}).populate('userId').populate('comment.userId')
    if(!post.length){
        return resp.status(400).json({status:'fail', data:'No post'})
    }
    resp.status(200).json({status:'success', data:post})  
})
//to get one posts
router.get('/post/:id', auth,async(req, resp)=>{
    const{id} = req.params
    const post = await Post.findById(id).populate('userId').populate('comment.userId')
    if(!post){
        return resp.status(400).json({status:'fail', data:'No post'})
    }
    resp.status(200).json({status:'success', data:post})  
})

//to add like
router.patch('/likes/:postId', auth,async(req, resp)=>{
    const {postId} = req.params
    const userId = req.user._id
    const post = await Post.findById(postId)
    if(!post){
        return resp.status(400).json({status:'fail', data:'No post'})
    }
    const index = post.like.indexOf(userId);
    if(index === -1){
        post.like.push(userId)
    }
    else{
        post.like.splice(index,1)
    }
    await post.save()
    const populatedPost = await Post.findById(postId)
    .populate('userId')
    .populate('comment.userId');
    resp.status(200).json({status:'success', data:populatedPost})  
})

// to delete post
router.delete('/deletePost/:postId', auth,async(req, resp)=>{
    const {postId} = req.params
    let post = await Post.findByIdAndDelete(postId)
    if(!post){
        return resp.status(400).json({status:'fail', data:'No post'})
    }
    resp.status(200).json({status:'success', data:'Post deleted succeffuly'})  
})

//to delete comment in apost
router.delete('/post/:postId/:commentId', auth,async(req, resp)=>{
    const{postId, commentId} = req.params
    const post = await Post.findById(postId)
    if(!post){
        return resp.status(400).json({status:'fail', data:'No post'})
    }
    post.comment = post.comment.filter(com=>com._id.toString() !== commentId)
    await post.save()
    resp.status(200).json({status:'success', data:'comment deleted succeffuly'})  
})



module.exports = router