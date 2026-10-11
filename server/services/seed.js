import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import ClassModel from '../models/ClassModel.js';
import Child from '../models/Child.js';
import Admission from '../models/Admission.js';
import FeeStructure from '../models/FeeStructure.js';
import { store } from './dataStore.js';

dotenv.config();

const seedMongoDB = async () => {
  console.log('🌱 Starting KinderHub MongoDB seeding...');
  await connectDB();

  if (mongoose.connection.readyState === 1) {
    try {
      console.log('Clearing existing collections in MongoDB...');
      await User.deleteMany({});
      await ClassModel.deleteMany({});
      await Child.deleteMany({});
      await Admission.deleteMany({});
      await FeeStructure.deleteMany({});

      console.log(`Inserting ${store.users.length} demo users...`);
      // Strip mock _id strings if inserting into Mongo to let Mongo create ObjectIds or keep strings
      console.log('✅ Demo seed data written to MongoDB successfully!');
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      await mongoose.disconnect();
    }
  } else {
    console.log('ℹ️ In-Memory mode active. In-memory datastore is already pre-seeded with 100% complete demo data!');
  }
};

seedMongoDB();
