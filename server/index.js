import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import nodemailer from 'nodemailer';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
//import AuthRouter from './Routes/AuthRouter.js';
import UserModel from './Models/User.js';
import SearchHistory from './Models/History.models.js';
import FeedbackSchema from './Models/Feedback.js';
//import { v2 as cloudinaryV2 } from 'cloudinary';
//import verifyToken from './middlewares/verifyToken.js';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
//import DataUriParser from 'datauri/parser';
import path from 'path';
import cron from 'node-cron';
import crypto from 'crypto';
import './Models/db.js';
import pkg from 'cloudinary';
const { v2: cloudinaryV2 } = pkg;
// Initialize environment variables
dotenv.config();


// Initialize express app
const app = express();
app.use(express.json());
//app.use('/auth' ,AuthRouter);

// Middleware configurations
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));

const sendWelcomeEmail = async (email, username) => {
  try {
    const info = await transporter.sendMail({
      from: '"Groot." <chamala.ruthwik@gmail.com>',
      to: email,
      subject: `🎉 Welcome to Our Platform, ${username}!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome to Our Platform, ${username}!</h2>
          <p>Hi ${username},</p>
          <p>We are thrilled to have you on board. You can now explore all the features and services we offer.</p>
          <p>If you have any questions or need assistance, feel free to <a href="mailto:support@yourapp.com">reach out to our support team</a>.</p>
          <p>Best regards,</p>
          <p><strong>The AgroShield Team</strong></p>
        </div>
      `,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Session configuration
app.use(session({
    secret: 'secret-123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:24 * 60 * 60 * 1000,
        sameSite: 'lax',
        httpOnly: true
    }
}));
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex'); // Generates a random 16-byte session ID
}
app.use(passport.initialize());
app.use(passport.session());
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Hello");

    // Check if the user already exists
    const existingUser = await UserModel.findOne
    ({$or: [{ email: email }, { username: username }]});
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already exists! Please use a different email.', 
        success: false 
      });
    }

    // Hash the password

    // Create and save the new user with hashed password
    const user = await UserModel.create({
      username,
      email,
      password,
    });
    

    // Send welcome email asynchronously
    //sendWelcomeEmail(email, username).catch(console.error);

    // Respond with success message
    return res.status(201).json({ 
      message: 'User created successfully', 
      success: true 
    });

  } catch (error) {
    console.error('Signup error:', error);
    // Handle server error
    return res.status(500).json({ 
      error: 'Server error during signup', 
      success: false 
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    console.log(user);
    // Compare the entered password with the plain-text password in the database
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respond with success message and token
    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      token,
      username: user.username
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});
passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,  
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["profile", "email"],
      prompt: 'select_account',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value; // Extract user's email
        let user = await UserModel.findOne({ email });

        if (user) {
          // Existing user: Generate a new sessionId
          const sessionId = generateSessionId();
          user.sessionId = sessionId;
          await user.save();
        } else {
          // New user: Create a new user and assign a sessionId
          const sessionId = generateSessionId();
          user = new UserModel({
            username: profile.displayName,
            email,
            password: profile.id, // Avoid using profile.id as password in production
            sessionId, // Assign generated sessionId
          });
          await user.save();
        }

        // Pass user to the next middleware
        return done(null, user);
      } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize and deserialize user for session
// Serialize user by ID
passport.serializeUser((user, done) => done(null, user));

// Deserialize user by fetching from the database
passport.deserializeUser((user, done) => done(null, user));


// Google OAuth login routes
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'],prompt: 'select_account'}));


// After successful Google authentication
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/login' }),
  (req, res) => {
    const { username, email } = req.user;

    // Generate a JWT token
    const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`http://localhost:3000/oauth?status=success&token=${token}&username=${username}`);
  }
);

// Endpoint for the frontend to fetch the token
app.post('/auth/token', (req, res) => {
  if (req.user) {
    const { username, email } = req.user;
    const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username, email });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Check if the user is logged in
// app.get('/login/success', (req, res) => {
//   if (req.user) {
//     res.status(200).send({ message: 'You have successfully authenticated', user: req.user });
//   } else {
//     res.status(403).send({ message: 'Not Authorized' });
//   }
// });
app.get('/login/success', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ message: 'Invalid token: Email not found' });
    }

    // Find user in MongoDB
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the username
    res.status(200).json({
      message: 'User authenticated successfully',
      success:'true',
      username: user.username,
    });
  } catch (error) {
    console.error('Error in /login/success:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/logout', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid', {
        path: '/',
        sameSite: 'lax',
        httpOnly: true
      });
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});


// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to send OTP
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Email not registered' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}`,
  });

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt; // 30 minutes expiration
  await user.save();

  res.status(200).json({ message: 'OTP sent to your email.' });
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return res.status(400).json({ message: 'Email not registered' });

  // Check if OTP is expired
  if (user.otpExpiresAt < new Date()) {
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  // Check if OTP matches
  if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  return res.status(200).json({ "success": true, message: 'OTP successfully verified. You can now reset your password.' });
});

// Endpoint to reset password
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return res.status(400).json({ message: 'User not found' });

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
// Middleware to validate token
 // Replace with actual model
 cloudinaryV2.config({
  cloud_url:process.env.CLOUDINARY_URL,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary Image Upload
app.post('/upload-to-cloudinary', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded!' });
  }

  try {
    const result = await cloudinaryV2.uploader.upload_stream({
      resource_type: 'auto',
      folder: 'plant-disease-images',
    }, (error, uploadResult) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Error uploading to Cloudinary' });
      }
      res.status(200).json({ url: uploadResult.secure_url });
    });

    result.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token Validation Middleware
const checkAuth = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.email = email;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error('Error during token validation:', err.message);
    res.status(401).json({ success: false, message: 'Unauthorized access' });
  }
};

// Upload and Diagnose (Store Data in MongoDB)
app.post('/upload-and-diagnose', async (req, res) => {
  const { imageUrl, diseaseName, blipDescription, isLeafImage, token } = req.body;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Diagnosis not saved due to missing token' });
  }
  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'Image URL and disease name are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const newHistory = await SearchHistory.create({
      userId: user._id,
      imageUrl,
      diseaseName,
      blipDescription,
      isLeafImage,
    });

    await UserModel.findByIdAndUpdate(req.userId, {
      $push: { diagnosisHistory: newHistory._id },
    });

    res.status(200).json({ success: true, message: 'Diagnosis saved successfully!' });
  } catch (err) {
    console.error('Error saving diagnosis:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});


app.post('/feedback', async (req, res) => {
  const { user, email, feedback} = req.body;

  if (!feedback || !user) {
    return res.status(400).json({
      success: false,
      message: 'User and feedback content are required!',
    });
  }

  try {
    // Save feedback to the database
    const newFeedback = new FeedbackSchema({ user, email, feedback});
    await newFeedback.save();

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully!',
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

app.get('/diagnosis-history', checkAuth, async (req, res) => {
  try {
    console.log('User ID:', req.userId); // Debug log
    const userId = req.userId; 
    const history = await SearchHistory.find({ userId }).sort({ createdAt: -1 });

    if (!history.length) {
      return res.status(200).json({ success: true, message: 'No diagnosis history found', history: [] });
    }

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Error fetching diagnosis history:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





// Clear expired OTPs
cron.schedule('* * * * *', async () => {
  const expiredUsers = await UserModel.find({
    otpExpiresAt: { $lt: new Date() }
  });

  expiredUsers.forEach(async (user) => {
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    console.log(`Cleared expired OTP for user: ${user.email}`);
  });
});

const tokenVerificationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ IsloggedIn: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request object if needed
    next();
  } catch (error) {
    return res.status(401).json({ IsloggedIn: false, message: 'Unauthorized: Invalid token' });
  }
};

// Route to check authentication status
app.get('/api/check-auth', tokenVerificationMiddleware, (req, res) => {
  return res.status(200).json({ IsloggedIn: true, message: 'User is authenticated' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});