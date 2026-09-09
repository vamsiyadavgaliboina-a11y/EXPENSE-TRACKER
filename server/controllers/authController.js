import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { verify } from 'otplib';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, twoFactorToken } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and check password
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return res.status(401).json({
          message: 'Two-factor authentication code required',
          code: 'TWO_FACTOR_REQUIRED',
        });
      }

      const result = await verify({
        token: String(twoFactorToken).replace(/\s/g, ''),
        secret: user.twoFactorSecret,
      });
      if (!result.valid) {
        return res.status(401).json({ message: 'Invalid two-factor authentication code' });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
