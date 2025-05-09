import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, regNumber, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { regNumber }]
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email or registration number'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      regNumber,
      passwordHash: password,
      role: role || 'student'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        regNumber: user.regNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(422).json({
      error: 'Registration failed',
      details: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { regNumber, password } = req.body;

    // Find user by registration number
    const user = await User.findOne({ regNumber });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        regNumber: user.regNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      details: error.message
    });
  }
};

export const logout = (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client should remove the token
  res.json({ message: 'Logged out successfully' });
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch user data',
      details: error.message
    });
  }
}; 