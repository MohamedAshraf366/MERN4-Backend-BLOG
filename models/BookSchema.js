let mongoose = require('mongoose')
let BookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false,
    },
    isOnScale:{
        type:Boolean,
        default:false,
    },
    discountPercent:{
        type:Number,
        default:0,
    },
    image:{
        type:String,
        default:'book.jpg',
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        reuired:true,
    }
    
})
module.exports = mongoose.model('Book', BookSchema)