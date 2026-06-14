const analyticsService = require('../services/analytics.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');
const User = require('../models/User');
const { NotFoundError, ConflictError } = require('../utils/errors');

const getDashboardData = asyncHandler(async (req, res) => {
  const result = await analyticsService.getDashboardMetrics(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (name) user.name = name;
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user.id.toString()) {
      throw new ConflictError('Email already in use');
    }
    user.email = email;
  }
  if (password) user.password = password;

  await user.save();

  res.status(statusCodes.OK).json({
    status: 'success',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

module.exports = {
  getDashboardData,
  updateProfile,
};
