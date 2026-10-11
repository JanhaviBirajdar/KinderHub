import mongoose from 'mongoose';

let isConnected = false;
let useMemoryFallback = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kinderhub';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback cleanly if no Mongo service
    });
    isConnected = true;
    useMemoryFallback = false;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return { isConnected: true, mode: 'mongodb' };
  } catch (error) {
    console.warn(`⚠️ Local MongoDB service not detected (${error.message}).`);
    console.log(`🚀 Activating KinderHub In-Memory Datastore for seamless zero-config demonstration!`);
    useMemoryFallback = true;
    return { isConnected: false, mode: 'in-memory' };
  }
};

export const getDBMode = () => (useMemoryFallback ? 'in-memory' : 'mongodb');
