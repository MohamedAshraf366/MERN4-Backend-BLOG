let jwt = require('jsonwebtoken')
let User = require('../../models/UserSocial')

let auth = async(req, resp, next)=>{
           try{
            let token = req.cookies.jwtCookies
            if(!token){
                return resp.status(400).json({status:'fail', data:'User is not loggedin'})
            }
            // to redecode token
            let decode = jwt.verify(token, process.env.SECRET_KEY)
            if(!decode){
                return resp.status(401).json({status:'fail', data:'Token not authorized'})
            }
            let user = await User.findById(decode.id).select('-password')
            if(!user){
                return resp.status(404).json({status:'fail', data:'User not found'})
            }
            req.user = user
            next()
        }
        catch(error){
            resp.status(500).json({status:'error', data:error.message})
        }
    }


module.exports = auth