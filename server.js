const express = require('express')
let app = express()
let cors = require('cors')
let path = require('path')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
let port = process.env.PORT || 3000
let connectDB = require('./config/connectionDB')
connectDB()

let allowedOrigin = [
    'http://localhost:5173', 'https://mern-4-frontend-blog-83r2.vercel.app'

  ]
app.use('/public', express.static('public'))// allow browser to show all data in public folder
app.use(express.urlencoded({extended:true}))//for search
app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin)

    if (!origin || allowedOrigin.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(cookieParser())
app.get('/', (req, res) => {
  res.send('API is working')
})
let post = require('./router/post')
let user = require('./router/user')
app.use('/post', post)
app.use('/user', user)



app.listen(port, ()=>{
    console.log(`server is working on port ${port}`)
})