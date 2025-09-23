const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: { 
        type: String 
    },
    manufactureDate: { 
        type: Date, 
        required: true 
    },
    expiryDate: { 
        type: Date, 
        required: true 
    },
    manufacturer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    ipfsHash: { 
        type: String 
    }, // hash lưu metadata/file chứng nhận
    qrCode: { 
        type: String 
    },   // link ảnh QR code
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Medicine", MedicineSchema)