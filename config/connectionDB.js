let mongoose = require('mongoose')
let connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("MongoDB connected Succefully")
    })
}

module.exports = connectDB