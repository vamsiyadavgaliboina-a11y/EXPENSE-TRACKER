import User from '../models/User.js';
import QRCode from 'qrcode';
import { generateSecret, generateURI, verify } from 'otplib';

export const getProfile = async (req, res, next) => {
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

export const updateProfile = async (req, res, next) => {
  try {
    const { name, monthlyIncome, currency } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
    if (currency) user.currency = currency;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const setupTwoFactor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('+twoFactorSecret');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Two-factor authentication is already enabled' });
    }

    const secret = generateSecret();
    const uri = generateURI({
      issuer: 'Expense Tracker',
      label: user.email,
      secret,
    });

    user.twoFactorSecret = secret;
    await user.save();

    res.status(200).json({
      qrCode: await QRCode.toDataURL(uri),
      manualKey: secret,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyTwoFactor = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.userId).select('+twoFactorSecret');

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'Start two-factor setup first' });
    }

    const result = await verify({ token: String(token || '').replace(/\s/g, ''), secret: user.twoFactorSecret });
    if (!result.valid) {
      return res.status(400).json({ message: 'Invalid authentication code' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({
      message: 'Two-factor authentication enabled',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const disableTwoFactor = async (req, res, next) => {
  try {
    const { currentPassword, token } = req.body;
    const user = await User.findById(req.user.userId).select('+password +twoFactorSecret');

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'Two-factor authentication is not enabled' });
    }

    if (!(await user.comparePassword(currentPassword || ''))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const result = await verify({ token: String(token || '').replace(/\s/g, ''), secret: user.twoFactorSecret });
    if (!result.valid) {
      return res.status(400).json({ message: 'Invalid authentication code' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.status(200).json({
      message: 'Two-factor authentication disabled',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};
