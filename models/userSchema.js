let mongoose = require('mongoose')
let validator = require('validator')
let UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
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
    },
})

let User = mongoose.model('User', UserSchema)
module.exports = User
