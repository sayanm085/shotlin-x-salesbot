import dotenv from 'dotenv';
dotenv.config();


// Application constants
export const DB_NAME = "shotlin_x";
export const DATABASE_URL = "mongodb+srv://Shotlin0912:Shotlin0912@shotlin.jpiyx.mongodb.net/";

// Other constants
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';