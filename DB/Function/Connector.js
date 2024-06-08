import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file based on the current environment
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const url = `${process.env.MONGO_URL_PREFIX}${username}:${password}${process.env.MONGO_URL_SUFFIX}`;

const dbName = `Expense_${env}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(`${url}/${dbName}`);
        return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export const disconnectDB = async () => {
    if (mongoose.connection) {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    }
};
