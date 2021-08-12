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
  IVerifyEmailInput, 
  EUserRole,
  IUserDataInput
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

const loginWithTel = catchReq(async (req: Request, res: Response) => {
  const user = await authService.loginUserWithTelAndPassword(req.body.tel, req.body.password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.ACCEPTED).send({ user, tokens });
});

const loginOrRegisterWithThirdParty = async (userData: IUserDataInput) => {
  let user = await authService.getUserByEmail(userData.email);
  if (!user) {
    user = await authService.userRegistration(userData);
  }
  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

const resendVerificationEmail = catchReq(async (req: Request, res: Response) => {
  const user = await authService.getUserByEmail(req.body.email);
  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.ALREADY_REPORTED, 'This email is already verified');
  }
  await sendVerificationEmail(user);
  res.status(httpStatus.OK).send("Email verification sent");
});

const googleAuth = catchReq(async (req: any, res: Response) => {
  if (req.user) {
    const userData: IUserDataInput = {
      email: req.user.emails[0].value,
      isEmailVerified: req.user.emails[0].verified,
      thirdPartyID: req.user.id,
      registeredWith: req.user.provider,
      role: EUserRole.DEVELOPER
    }
    const { user, tokens } = await loginOrRegisterWithThirdParty(userData);
    res.status(httpStatus.ACCEPTED).send({ user, tokens });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this account');
  }
});

const forgotPassword = catchReq(async (req: Request, res: Response) => {
  // Email verification
  const user = await authService.getUserByEmail(req.body.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');

  // new Password genenration
  const newPassword = generatePassword(12, false, /[\w]/);
  await authService.resetPassword(user._id, newPassword);

  // Send the new password by email
  await emailService.sendResetPasswordEmail(req.body.email, newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchReq(async (req: any, res: Response) => {
  await authService.checkPassword(req.query.userID, req.body.oldPassword);
  await authService.resetPassword(req.query.userID, req.body.newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchReq(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const logout = catchReq(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchReq(async (req: any, res: Response) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.status(httpStatus.ACCEPTED).send('Email verified.');
  } catch(error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
});

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
  googleAuth
};

export default authController;
