    const mongoose = require('mongoose')
    const postSocialSchema =  new mongoose.Schema({
        userId:{
            type : mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'UserSocial'
        },
        postContent:{
            type:String,
        },
        
        like: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserSocial' }],
            default: []
            },
        comment:[{
            userId:{
                type : mongoose.Schema.Types.ObjectId,
                ref:'UserSocial',
                required: true,
            },
            commentText:{
                type : String,
            },
            commentImage:{
                type:String
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }],
        postImage:{
            type:String,
        }
    },{timestamps:true})
    module.exports = mongoose.model('PostSocial', postSocialSchema)