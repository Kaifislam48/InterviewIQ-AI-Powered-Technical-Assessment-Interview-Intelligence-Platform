const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser(name, email, password);
  res.status(statusCodes.CREATED).json({
    status: 'success',
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(statusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Refresh token is required',
    });
  }
  const result = await authService.refreshAccessToken(refreshToken);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(statusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Token is required',
    });
  }
  const result = await authService.verifyEmailToken(token);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: result.message,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.requestPasswordReset(email);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: result.message,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  if (!token) {
    return res.status(statusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Token is required',
    });
  }
  const result = await authService.resetPasswordTokenValue(token, password);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: result.message,
  });
});

const logout = asyncHandler(async (req, res) => {
  // Clear tokens or sessions if we were storing them server-side, 
  // but since we are stateless JWT, simply return success.
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

module.exports = {
  register,
  login,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
};
