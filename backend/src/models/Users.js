const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    addresses: [
    {
        id: String,
        fullName: String,
        phone: String,
        address: String,
        ward: String,
        district: String,
        city: String,
        isDefault: Boolean
    }
    ],
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String, 
        enum: ["Nam", "Nữ", "Khác"], 
        default: "Nam"
    },
    role: { 
        type: String, 
        enum: ["user", "pharmacy", "distributor", "admin", "banner"], 
        default: "user"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model("User", UserSchema);