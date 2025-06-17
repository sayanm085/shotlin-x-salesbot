// Database connection configuration
import mongoose from 'mongoose';
import { DB_NAME, DATABASE_URL } from "../constants.js";
import { logger } from '../lib/logger.js';

const connectDB = async () => {
  try {
    // Using your specific MongoDB connection string
    let databaseResponse = await mongoose.connect(`mongodb+srv://Shotlin0912:Shotlin0912@shotlin.jpiyx.mongodb.net/${DB_NAME}`);
    
    console.log(`\n MongoDB connected successfully to the database ${DB_NAME} 😎😎 :-> ${databaseResponse.connection.host}`);
    logger.info(`MongoDB connected to ${DB_NAME} at ${databaseResponse.connection.host}`);
  } catch (error) {
    console.log("error in db connection", error);
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Export the connection function
export default connectDB;