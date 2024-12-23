import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from a .env file (if you're using one)
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_CONN;

    // Check if MONGO_CONN is undefined
    if (!mongoURI) {
      throw new Error('MongoDB connection URI is not defined in the environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// Explicitly call `connectDB` if needed at module load
connectDB();

export default connectDB;
