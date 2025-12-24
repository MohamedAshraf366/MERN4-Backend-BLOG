let mongoose = require('mongoose')
let validator = require('validator')
let UserSocialSchema = new mongoose.Schema({
    userName:{
        type : String,
        required:true,
    },
    email:{
        type : String,
        required:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type : String,
        required:true,
    },
    image:{
        type:String,
    }
},{timestamps:true})
module.exports = mongoose.model('UserSocial', UserSocialSchema)