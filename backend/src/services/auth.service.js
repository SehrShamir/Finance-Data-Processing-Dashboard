const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { User, Role } = require('../models');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const VIEWER_ROLE_ID = 1;

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
  }

  const user = await User.create({
    name,
    email,
    password_hash: password, // hashed by beforeCreate hook
    role_id: VIEWER_ROLE_ID,
  });

  return User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email, is_active: true },
    include: [{ model: Role, as: 'role' }],
  });

  if (!user || !(await user.checkPassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  await user.update({ last_login_at: new Date() });

  const token = jwt.sign(
    { sub: String(user.id), role: user.role.name },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return { token, user };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  if (!(await user.checkPassword(currentPassword))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Current password is incorrect');
  }

  await user.update({ password_hash: newPassword }); // hashed by beforeUpdate hook
};

module.exports = { register, login, changePassword };
