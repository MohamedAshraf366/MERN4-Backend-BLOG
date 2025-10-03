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
        validate(value){
                var password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
                if(!password.test(value)){
                    throw new Error('The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.');
                }
            }
    },
    role:{
        type:String,
        default:'user'
    },
}, {timestamps:true})
module.exports = mongoose.model('User', UserSchema)