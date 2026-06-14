const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { sendEmail } = require('../helpers/email');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} = require('../utils/errors');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

const registerUser = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  // Send email (asynchronously, do not block registration response)
  const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
  sendEmail({
    to: user.email,
    subject: 'Verify your InterviewIQ account',
    text: `Welcome to InterviewIQ, ${user.name}! Please verify your email by clicking: ${verificationUrl}`,
  }).catch((err) => console.error('Failed to send verification email:', err));

  // Return user without password (password is select:false anyway)
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
};

const loginUser = async (email, password) => {
  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('Invalid refresh token owner');
    }

    const accessToken = generateAccessToken(user._id);
    return { accessToken };
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

const verifyEmailToken = async (token) => {
  const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
  if (!user) {
    throw new BadRequestError('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return { message: 'Email verified successfully!' };
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) {
    // Return mock success to prevent email enumeration
    return { message: 'If an account exists with that email, a reset link has been sent.' };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
  sendEmail({
    to: user.email,
    subject: 'Reset your InterviewIQ Password',
    text: `You requested a password reset. Please click on the link to set a new password: ${resetUrl}\nIf you did not request this, please ignore.`,
  }).catch((err) => console.error('Failed to send reset email:', err));

  return { message: 'If an account exists with that email, a reset link has been sent.' };
};

const resetPasswordTokenValue = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw new BadRequestError('Reset token is invalid or has expired');
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: 'Password updated successfully!' };
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyEmailToken,
  requestPasswordReset,
  resetPasswordTokenValue,
};
