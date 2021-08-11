import Joi from 'joi';
import { EUserRole } from '../config/types';

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    tel: Joi.string().required(),
    role: Joi.string().required().valid(EUserRole.DEVELOPER, EUserRole.MANAGER),
  }),
};

const loginWithEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginWithTel = {
  body: Joi.object().keys({
    tel: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resendVerificationEmail = {
  query: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: {
    userID: Joi.string().required()
  },
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
  

const authValidation = {
  register,
  loginWithEmail,
  loginWithTel,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

export default authValidation;
