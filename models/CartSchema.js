let mongoose = require('mongoose')
let CartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[ //make an array because each object handle the menu food and its count
        {
        menu:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu',
        required:true,
    },
    qty:{
        type:Number,
        min:1,
        required:true,
        default:1,
    }
        }
    ]
       
},{timestamps:true})
let Cart = mongoose.model('Cart', CartSchema)
module.exports = Cart