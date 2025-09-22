let mongoose = require('mongoose')
let CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'KarmElsham.webp'
    },
})
CategorySchema.pre('save', function(next){
    this.name = this.name.toLowerCase().trim()
    next()
})
let Category = mongoose.model('Category', CategorySchema)
module.exports = Category