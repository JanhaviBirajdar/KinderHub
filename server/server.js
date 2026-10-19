import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, getDBMode } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import childRoutes from './routes/childRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import classRoutes from './routes/classRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import communicationRoutes from './routes/communicationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import kinderGrowthRoutes from './routes/kinderGrowthRoutes.js';
import kinderConnectRoutes from './routes/kinderConnectRoutes.js';
import kinderSafeRoutes from './routes/kinderSafeRoutes.js';
import kinderQuestRoutes from './routes/kinderQuestRoutes.js';
import kinderOfflineRoutes from './routes/kinderOfflineRoutes.js';
import kinderPredictRoutes from './routes/kinderPredictRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database (Real Mongo or In-Memory Store)
await connectDB();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or missing origin
    if (!origin) return callback(null, true);
    // Allow configured origins, any Vercel domain, or localhost
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & System Info API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Kinder Hub – Preschool Management API',
    version: '1.0.0',
    mode: getDBMode(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Innovative Preschool Modules
app.use('/api/kindergrowth', kinderGrowthRoutes);
app.use('/api/kinderconnect', kinderConnectRoutes);
app.use('/api/kindersafe', kinderSafeRoutes);
app.use('/api/kinderquest', kinderQuestRoutes);
app.use('/api/kinderoffline', kinderOfflineRoutes);
app.use('/api/kinderpredict', kinderPredictRoutes);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🎈 KinderHub Server running smoothly on http://localhost:${PORT}`);
  console.log(`🌟 Operating mode: ${getDBMode().toUpperCase()}`);
});

export default app;
