let express = require('express')
let router = express.Router()
let multer = require('multer')
let Category = require('../models/CategorySchema')

router.post('/createCategory', async(req, resp)=>{
    let{name} = req.body
    if(!name){
      return resp.status(400).json({status:'fail', data:'Thanks to fill required field'})  
    }
    let category = new Category({name})
    await category.save()
    resp.status(200).json({status:'success', data:category})
})

router.get('/allCategory', async(req, resp)=>{
   try{
    let category = await Category.find()
    if(!category){
      return resp.status(400).json({status:'fail', data:'No Category'}) 
    }
    resp.status(200).json({status:'success', data:category})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

router.get('/count', async(req, resp)=>{
    try{
        let count = await Category.countDocuments()
        resp.status(200).json({status:'success', data:count})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

module.exports = router