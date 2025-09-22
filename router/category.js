let express = require('express')
let router = express.Router()
let multer = require('multer')
let path = require('path')
const auth = require('../auth/middleWare')
const Category = require('../models/categorySchema')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/category'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)  // نجيب الامتداد الأصلي
    const filename = Date.now() + '-' + file.fieldname + ext
    cb(null, filename)
  }
})
const upload = multer({ storage: storage })
//1- to create category
router.post('/addCategory', auth('admin') , upload.single('image'), async(req, resp)=>{
    try{
        let name = req.body.name.toLowerCase().trim();
        let{description, image} = req.body
        if(!name || !description){
            return resp.status(400).json({status:'fail', data:'Thanks to fill required data'})
        }
        let oldCategory = await Category.findOne({name})
        if(oldCategory){
            return resp.status(404).json({status:'fail', data:'menu:This menue is exit'})
        }
        let category = new Category({name, description, 
            image: req.file?req.file.filename :undefined}
        )
        await category.save()
        resp.status(200).json({status:'success', data:category})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

//2- to get all category
router.get('/allCategory', async(req, resp)=>{
    try{
        let category = await Category.find()
        if(!category){
            resp.status(400).json({status:'fail', data:category})
        }
        resp.status(200).json({status:'success', data:category})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

//3- to get cout of all category
router.get('/count', async(req, resp)=>{
    try{
        let count = await Category.countDocuments()
        resp.status(200).json({status:'success', data:count})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

//4- to get specific category
router.get('/:id', async(req, resp)=>{
    try{
        let {id} = req.params
        let category = await Category.findById(id, {'__v':0})
        if(!category){
            resp.status(400).json({status:'fail', data:'category is not found'})
        }
    resp.status(200).json({status:'success', data:category})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})
module.exports = router