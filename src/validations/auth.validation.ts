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

const loginWithTel = Joi.object().keys({
  tel: Joi.string().required(),
  password: Joi.string().required(),
});

const logout = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

const refreshTokens = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

const forgotPassword = Joi.object().keys({
  email: Joi.string().email().required(),
});

const resetPassword = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

const verifyEmail = Joi.object().keys({
  token: Joi.string().required(),
});
  

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
