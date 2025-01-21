// Import Mongoose 
const mongoose = require('mongoose')


// Route Handler 
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
    }
}, { timestamps: true })


// Export 
module.exports = mongoose.model("User", userSchema)