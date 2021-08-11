import httpStatus from 'http-status';
import { Token, User } from '../models';
import { ApiError } from '../utils';
import tokenService from './token.service';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const userRegistration = async (userBody: any) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isTelTaken(userBody.tel)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tel already taken');
  }
  return User.create(userBody)
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id: any) => {
  return User.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
 const updateUserById = async (userId: string, updateBody: any) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.tel && (await User.isTelTaken(updateBody.tel, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tel already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

/**
 * Get user by tel
 * @param {string} tel
 * @returns {Promise<User>}
 */
const getUserByTel = async (tel: string) => {
  return User.findOne({ tel });
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
 const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with tel and password
 * @param {string} tel
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithTelAndPassword = async (tel: string, password: string) => {
  const user = await getUserByTel(tel);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Tel or password');
  }
  return user;
};

/**
 * Check the password
 * @param userId 
 * @param password 
 */
const checkPassword = async (user: any, password: string) => {
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password');
  }
};

/**
 * TODO --- Logout (Think about it) 
 */
const logout = async (refreshToken: string) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: global.tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {User} user
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (user: any, refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, global.tokenTypes.REFRESH);
    if (user.id !== refreshTokenDoc.user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {User} user
 * @param {string} newPassword
 */
const resetPassword = async (user: any, newPassword: string) => {
  try {
    await updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, global.tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: global.tokenTypes.VERIFY_EMAIL });
    await updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const authService = {
  userRegistration,
  getUserById,
  updateUserById,
  getUserByEmail,
  getUserByTel,
  loginUserWithEmailAndPassword,
  loginUserWithTelAndPassword,
  refreshAuth,
  resetPassword,
  verifyEmail,
  checkPassword,
  logout
};

export default authService;
