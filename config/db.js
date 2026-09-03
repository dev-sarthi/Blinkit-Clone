const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { autoSeedIfEmpty } = require('../utils/seed');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.error('CRITICAL: MONGO_URI environment variable is missing! Please set MONGO_URI in your environment settings (e.g. on Render Dashboard).');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    await autoSeedIfEmpty();
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
