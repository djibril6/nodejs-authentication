import express from 'express';
import { authController } from '../controllers';
import { validate } from '../middlewares';
import { authValidation } from '../validations';

const authRoute = express.Router();

authRoute.post('/register',  validate(authValidation.register), authController.register);
authRoute.post('/email-login',  validate(authValidation.loginWithEmail), authController.loginWithEmail);
authRoute.post('/tel-login',  validate(authValidation.loginWithTel), authController.loginWithTel);
authRoute.post('/logout', validate(authValidation.logout), authController.logout);
authRoute.get('/verify-email/:token', validate(authValidation.verifyEmail), authController.verifyEmail);
authRoute.post('/send-email-verification', 
    validate(authValidation.resendVerificationEmail), 
    authController.resendVerificationEmail);
authRoute.post('/reset-token', validate(authValidation.refreshTokens), authController.refreshTokens);
authRoute.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
authRoute.patch('/update-password', validate(authValidation.resetPassword), authController.resetPassword);

export default authRoute;