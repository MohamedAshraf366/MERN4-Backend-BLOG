let jwt = require('jsonwebtoken');
let auth = (requireRole = null)=>{

    
    return (req, resp, next)=>{
    try{
            let authHeader = req.headers['Authorization'] || req.headers['authorization']
            if(!authHeader){
                return resp.status(401).json({status:'fail', data:'Authorization header missing' })
            }
            let token = authHeader.split(' ')[1]
            if(!token){
                return resp.status(402).json({status:'fail', data:'token missing' })
            }
            let decodedData = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decodedData
            console.log(decodedData)
               //to check the user isrole :  admin or user
               if(requireRole && decodedData.role.toLowerCase() !== requireRole.toLowerCase()){
                return resp.status(403).json({status:'fail', data:'Access denied' })
               }
            next()
        }
        catch(e){
             return resp.status(500).json({ status:'error', data: "Invalid or expired token" });
        }
}
}

module.exports = auth