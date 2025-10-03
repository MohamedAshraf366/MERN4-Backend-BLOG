let mongoose = require('mongoose')

let CartItemSchema = new mongoose.Schema({
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
        default:1
    },
    price:{
        type:Number,
        required:true,
    }
})


let CartSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        items:[CartItemSchema],//to show all product by user
        totalAmount:{
            type:Number,
            required:true,
            default:0,
        },
        totalPrice:{
            type:Number,
            required:true,
            default:0,
        },
})

module.exports = mongoose.model('Cart', CartSchema)