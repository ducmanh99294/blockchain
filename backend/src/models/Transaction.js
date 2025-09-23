const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    batch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Medicine", 
        required: true 
    },
    fromUser: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
    },
    toUser: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
    },
    location: { 
            type: String
    },
    timestamp: { 
            type: Date, 
            default: Date.now 
    }    
});

module.exports = mongoose.model("Transaction", TransactionSchema)