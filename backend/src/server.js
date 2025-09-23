require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const multer = require('multer');

const connectMongoDB = require('./config/mongodbConfig');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const cookieParser = require('cookie-parser');

const medicineRouter = require('./routes/MedicineRoutes');
const certificateRouter = require('./routes/CertificateRoutes');
const transactionRouter = require('./routes/TransactionRoutes');
const userRouter = require('./routes/UserRoutes');
const pharmacyRouter = require('./routes/PharmacyRoutes');
const distributorRouter = require('./routes/DistributorRoute');
const authRouter = require('./routes/AuthRoutes');

app.use(cookieParser());
// Connect to MongoDB
connectMongoDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173','https://fe-webdoluuniem.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
}));;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Truyền io vào request
app.use((req, res, next) => {
  req.io = io;
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Middleware xử lý lỗi upload
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' 
        ? 'File too large (max 10MB)' 
        : 'File upload error'
    });
  } else if (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'File processing failed'
    });
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/socket.io')) return next();
  console.info(`Received request: ${req.method} ${req.url}`);
  if (req.file || req.files) {
    console.info(`Uploaded files: ${JSON.stringify({
      count: req.files?.length || 1,
      names: req.files?.map(f => f.originalname) || [req.file.originalname]
    })}`);
  }
  next();
});

// Start server
server.listen(PORT, () => {
  console.info(`Server is running on http://${HOST}:${PORT}`);
});

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});

// Routes
app.use("/api/medicine", medicineRouter);
app.use("/api/certificate", certificateRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/user", userRouter);
app.use("/api/pharmacy", pharmacyRouter);
app.use("/api/distributor", distributorRouter);
app.use("/api", authRouter);


// Custom 404 middleware
app.use((req, res, next) => {
  console.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Không tìm thấy tài nguyên: ${req.originalUrl}`,
  });
});