require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL || 'mongodb+srv://nguyenducmanh1809:manh1234@cluster0.1ya4y.mongodb.net/QuanLiThuoc?retryWrites=true&w=majority&appName=Cluster0';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        
    } catch (error) {
        console.error('MongoDB connection error', error)
    }
}

module.exports = connectMongoDB;