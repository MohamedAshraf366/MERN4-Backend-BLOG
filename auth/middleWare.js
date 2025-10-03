let jwt = require('jsonwebtoken');
let auth = (requireRole = null)=>{
    return(req, resp, next)=>{
       try{
             authHeader = req.headers['Authorization'] || req.headers['authorization']
            if(!authHeader){
                return resp.status(400).json({status:'fail', data:'Authorization header missing'})
            }
            let token = authHeader.split(' ')[1]
            if(!token){
                return resp.status(402).json({status:'fail', data:'token is misssing'})
            }
            let decodedData = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decodedData 
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

let cookieAuth = (requireRole = null)=>{
    return(req, resp, next)=>{
        try{
        let token = req.cookies.token
        if(!token){
            return resp.status(402).json({status:'fail', data:'token cookies is misssing'})
        }
        let decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        if(requireRole && decoded.role.toLowerCase() !== requireRole.toLowerCase()){
            return resp.status(403).json({status:'fail', data:'Access denied' })
            }
        next()
    }
    catch(e){
            return resp.status(500).json({ status:'error', data: "Cookies:Invalid or expired token" });
    }
    }
    
}
module.exports = {auth, cookieAuth}