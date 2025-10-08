let mongoose = require('mongoose')
let validator = require('validator')
let UserBlogSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'user'
    }
})

module.exports = mongoose.model('UserBlog', UserBlogSchema)