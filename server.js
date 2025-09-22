const express = require('express')
let app = express()
let cors = require('cors')
let path = require('path')
const dotenv = require('dotenv').config()
let port = process.env.PORT || 3000
let connectDB = require('./config/connectionDB')
connectDB()
app.use(express.json())
app.use(cors())
let user = require('./router/user')
let category = require('./router/category')
let menu = require('./router/menu')
let cart = require('./router/cart')
app.use('/user', user)
app.use('/category', category)
app.use('/menu', menu)
app.use('/cart', cart)

app.use('/public', express.static('public'))// allow browser to show all data in public folder
app.use('/uploads/category', express.static(path.join(__dirname, 'public/category')))
app.use('/uploads/menu', express.static(path.join(__dirname, 'public/menu')))


app.listen(port, ()=>{
    console.log(`server is working on port ${port}`)
})