import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';  // Import JWT for token generation
import bcrypt from 'bcryptjs';   // Ensure bcrypt is available for password hashing
import { type } from 'os';
const { Schema } = mongoose;

// Define the schema for the User
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  coverImage:{
    type: String,
  },
  diagnosisHistory:[
    {
      type: Schema.Types.ObjectId,
      ref: 'SearchHistory',
    }
  ],
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
},
{
  timestamps: true, // Correct placement of timestamps
}
);

// Method to generate JWT token
UserSchema.methods.generateToken = function () {
  // Use JWT to sign a token containing the user's ID and role, valid for 24h
  const token = jwt.sign(
    {
      username: this.username,
      email:this.email,
      role: this.role,
    },
    process.env.JWT_SECRET, // Make sure this is defined in your .env file
    { expiresIn: '24h' }    // Token expiration set to 24 hours
  );
  return token;
};


const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
