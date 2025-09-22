let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
let multer = require('multer')
let path = require('path')
const auth = require('../auth/middleWare')
const Menu = require('../models/menuSchema')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/menu'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)  // نجيب الامتداد الأصلي
    const filename = Date.now() + '-' + file.fieldname + ext
    cb(null, filename)
  }
})
const upload = multer({ storage: storage })
//1- to create menu for a specific category
router.post('/addMenu', auth('admin') , upload.single('image'), async(req, resp)=>{
    try{
        let name = req.body.name.toLowerCase().trim();
        let{description, image,price, available, category} = req.body
        if(!name || !description || !price || !category){
            return resp.status(400).json({status:'fail', data:'menu:Thanks to fill required data'})
        }
        let oldMenu = await Menu.findOne({name})
        if(oldMenu){
            return resp.status(404).json({status:'fail', data:'menu:This menue is exit'})
        }
        if(price === 0){
           return resp.status(405).json({status:'fail', data:'menu:This price cant be zero'}) 
        }
        let menu = new Menu({name, description, price, available, 
            category,
            image: req.file?req.file.filename :undefined}
        )
        await menu.save()
        resp.status(200).json({status:'success', data:menu})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error.message})
    }
})

//2- to get all menu items
router.get('/allMenu', async(req, resp)=>{
    try{
        let menu = await Menu.find().populate('category')
        if(!menu){
            resp.status(400).json({status:'fail', data:menu})
        }
        resp.status(200).json({status:'success', data:menu})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

//3- to get cout of all category
router.get('/count', async(req, resp)=>{
    try{
        let count = await Menu.countDocuments()
        resp.status(200).json({status:'success', data:count})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

//4- to get specific menu
router.get('/:id', async(req, resp)=>{
    try{
        let {id} = req.params
        let menu = await Menu.findById(id, {'__v':0})
        if(!menu){
            resp.status(400).json({status:'fail', data:'menu is not found'})
        }
    resp.status(200).json({status:'success', data:menu})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})

// 5- to get menu for specific category
router.get('/menuByCategory/:categoryId', async(req, resp)=>{
    try{
        let {categoryId} = req.params
         if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return resp.status(404).json({ status: 'fail', data: 'menu:Invalid category ID' });
            }
        let menu = await Menu.find({category:categoryId}).populate('category', 'name description')
        if(!menu){
           return  resp.status(400).json({status:'fail', data:'menu:menu is not found'})
        }
        resp.status(200).json({status:'success', data:menu})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error.message})
    }
})
module.exports = router