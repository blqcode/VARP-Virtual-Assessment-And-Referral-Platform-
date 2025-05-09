import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  regNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v);
      },
      message: 'Registration number must be exactly 9 digits'
    }
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['student', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ regNumber: 1 }, { unique: true });

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User; 