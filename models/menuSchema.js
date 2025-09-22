let mongoose = require('mongoose')
let MenuSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    image:{
        type:String,
        default:'KarmElsham.webp'
    },
    available:{
        type:Boolean,
        default:false
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }
},{timestamps:true})
MenuSchema.pre('save', function(next){
    this.name = this.name.toLowerCase().trim()
    next()
})
let Menu = mongoose.model('Menu', MenuSchema)
module.exports = Menu