let mongoose = require('mongoose')
let bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
let auth = (requiredRoll = null)=>{
    return(req, resp, next)=>{
        try{
            let authHeader = req.headers['Authorization'] || req.headers['authorization']
            if(!authHeader){
                return resp.status(400).json({status:'fail',data:'Authorization header missing'})
            }
            let token = authHeader.split(' ')[1]
            if(!token){
                return resp.status(400).json({status:'fail',data:'Token is missing'})
            }
            let decodedData = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decodedData
            if(requiredRoll && decodedData.role.toLowerCase() !== requiredRoll.toLowerCase()){
                return resp.status(403).json({status:'fail', data:'Access denied' })
            }
            next()
        }
        catch(error){
            resp.status(500).json({status:'error', data:error.message})
        }
    }
}

module.exports = auth