const express = require('express')
let app = express()
let cors = require('cors')
let path = require('path')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
let port = process.env.PORT || 3000
let connectDB = require('./config/connectionDB')
connectDB()
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
let allowedOrigin = [
    'http://localhost:3000'
]
app.use(cors({
    origin:function(origin, callback){
        if(!origin || allowedOrigin.includes(origin)){
            callback(null, true)
        }
        else{
            callback(new Error("Not allowed by CORS"));
        }
    } ,
    credentials:true
}))
app.use(cookieParser())
let user = require('./router/user')
let post = require('./router/post')
app.use('/user', user)
app.use('/post', post)
app.listen(port, ()=>{
    console.log(`server is working on port ${port}`)
})