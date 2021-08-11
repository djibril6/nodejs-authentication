import httpStatus from 'http-status';
import { Request, Response } from 'express';
import generatePassword from 'password-generator';
import { ApiError, catchReq } from '../utils';
import { authService, emailService } from '../services';
import { authValidation } from '../validations';
import tokenService from '../services/token.service';
import { 
  IRegistrationInput, 
  IEmailLoginInput, ITelLoginInput, 
  IForgotPasswordInput, 
  IResetPasswordInput, 
  IRefreshTokenInput, 
  ILogoutInput, 
  IVerifyEmailInput 
} from '../config/types';

const register = catchReq(async (req: Request, res: Response) => {

  const user = await authService.userRegistration(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  await sendVerificationEmail(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});


const sendVerificationEmail = async (user: any) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
};

const loginWithEmail = catchReq(async (req: Request, res: Response) => {
  const user = await authService.loginUserWithEmailAndPassword(req.body.email, req.body.password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.ACCEPTED).send({ user, tokens });
});

const loginWithTel = async (args: ITelLoginInput) => {
  try {
    
  } catch (error) {
    
  }
  // Data validation
  const { error } = authValidation.loginWithTel.validate(args);
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${error.message}`);

  const user = await authService.loginUserWithTelAndPassword(args.tel, args.password);
  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

const loginOrRegisterWithThirdParty = async (userData: any) => {
  try {
    
  } catch (error) {
    
  }
  let user = await authService.getUserByEmail(userData.email);
  if (!user) {
    user = await authService.userRegistration(userData);
  }
  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

const resendVerificationEmail = async (args: any) => {
  try {
    
  } catch (error) {
    
  }
  const user = await authService.getUserByEmail(args.email);
  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.ALREADY_REPORTED, 'This email is already verified');
  }
  await sendVerificationEmail(user);
};

const forgotPassword = async (args: IForgotPasswordInput) => {
  try {
    
  } catch (error) {
    
  }
  // Data validation
  const { error } = authValidation.forgotPassword.validate(args);
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${error.message}`);

  // Email verification
  const user = await authService.getUserByEmail(args.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');

  // new Password genenration
  const newPassword = generatePassword(12, false, /[\w]/);
  await authService.resetPassword(user, newPassword);

  // Send the new password by email
  await emailService.sendResetPasswordEmail(args.email, newPassword);
};

const resetPassword = async (user: any, args: IResetPasswordInput) => {
  try {
    
  } catch (error) {
    
  }
  // Data validation
  const { error } = authValidation.resetPassword.validate(args);
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${error.message}`);

  await authService.checkPassword(user, args.oldPassword);

  await authService.resetPassword(user, args.newPassword);
};

const refreshTokens = async (user: any, args: IRefreshTokenInput) => {
  try {
    
  } catch (error) {
    
  }
  // Data validation
  const { error } = authValidation.refreshTokens.validate(args);
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${error.message}`);

  const tokens = await authService.refreshAuth(user, args.refreshToken);
  return tokens;
};

const logout = async (args: ILogoutInput) => {
  try {
    
  } catch (error) {
    
  }
  // Data validation
  const { error } = authValidation.logout.validate(args);
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${error.message}`);

  const tokens = await authService.logout(args.refreshToken);
  return tokens;
};

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = async (args: IVerifyEmailInput, res: Response) => {
  try {
    await authService.verifyEmail(args.token);
    res.status(httpStatus.ACCEPTED).send('Email verified.');
  } catch(error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

const authController = {
  register,
  loginWithEmail,
  loginWithTel,
  loginOrRegisterWithThirdParty,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  resendVerificationEmail,
};

export default authController;
