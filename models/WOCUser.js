const mongoose = require('mongoose');

// Update the WOCUser schema to include the contributions field
const WOCuserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  forgotPassword: String,
  forgotPasswordExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  contributions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  }],
  
  points: {
    type: Number,
    default: 0, // Default value for points
  }
  
});

const WOCUser = mongoose.models.WOCUser || mongoose.model("WOCUser", WOCuserSchema);

module.exports =  WOCUser;

