let express = require('express')
let router = express.Router()
let multer = require('multer')
let path = require('path')
let Book = require('../models/BookSchema')
let {auth, cookieAuth} = require('../auth/middleware')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/book'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)  // نجيب الامتداد الأصلي
    const filename = Date.now() + '-' + file.fieldname + ext
    cb(null, filename)
  }
})
const upload = multer({ storage: storage })

// 1- to create a new book
router.post('/createBook' , auth('admin'), upload.single('image') ,async(req, resp)=>{
    try{
        let{title, author, description, price, stock, isFeatured, isOnScale, discountPercent, category} = req.body
        if(!title || !author || !description || !price || !stock || !category){
            return resp.status(400).json({status:'fail', data:'All field must be required'}) 
        }
        let book = new Book({title, author, description, price, stock, isFeatured, isOnScale, discountPercent, category,
            image: req.file?req.file.filename :undefined
        })
        await book.save()
        resp.status(200).json({status:'success', data:book})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

// 2- to get all books
router.get('/allBook', async(req, resp)=>{
    try{
        let book = await Book.find().populate('category')
        if(!book){
            return resp.status(400).json({status:'fail', data:'No Book'}) 
        }
        resp.status(200).json({status:'success', data:book})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})
router.get('/count', async(req, resp)=>{
    try{
        let count = await Book.countDocuments()
        resp.status(200).json({status:'success', data:count})
    }
    catch(error){
        return resp.status(500).json({status:'error', data:error})
    }
})
// 3- tp moodify on book data
router.patch('/updateBook/:id',cookieAuth(), upload.single('image'), async(req, resp)=>{
    try{
        let {id} = req.params
        let book = await Book.findByIdAndUpdate(id, req.body,{
            new:true,
            runValidators:true
        }).populate('category')
        if(!book){
                return resp.status(400).json({status:'fail', data:'No Book'}) 
            }
            resp.status(200).json({status:'success', data:book})
        }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

//4- to get book by id
router.get('/allBook/:id', async(req, resp)=>{
    try{
        let {id} = req.params
        let book = await Book.findById(id).populate('category')
        if(!book){
            return resp.status(400).json({status:'fail', data:'No Book'}) 
        }
        resp.status(200).json({status:'success', data:book})
    }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }

})

//5- to delete book
router.delete('/deleteBook/:id',cookieAuth(), async(req, resp)=>{
    try{
        let {id} = req.params
        let book = await Book.findByIdAndDelete(id)
        if(!book){
            return resp.status(400).json({status:'fail', data:'No Book'}) 
        }
        resp.status(200).json({status:'success', data:'book deleted succefully'})
        }
    catch(error){
        resp.status(500).json({status:'error', data:error}) 
    }
})

module.exports = router