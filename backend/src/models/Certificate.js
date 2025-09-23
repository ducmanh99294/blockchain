const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    batch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Medicine", 
        required: true 
    },
    fileUrl: { 
        type: String, 
        required: true 
    }, // lưu link file chứng nhận (server/IPFS)
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Certificate", certificateSchema);
