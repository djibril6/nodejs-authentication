import express from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { EUserRole } from '../config/types';
import { authController } from '../controllers';
import { auth, validate } from '../middlewares';
import { ApiError } from '../utils';
import { authValidation } from '../validations';

const authRoute = express.Router();

authRoute.post('/register', validate(authValidation.register), authController.register);
authRoute.post('/email-login',  validate(authValidation.loginWithEmail), authController.loginWithEmail);
authRoute.post('/tel-login',  validate(authValidation.loginWithTel), authController.loginWithTel);
authRoute.post('/logout', 
    auth(EUserRole.DEVELOPER, EUserRole.MANAGER),
    validate(authValidation.logout), authController.logout);
authRoute.get('/verify-email/:token', validate(authValidation.verifyEmail), authController.verifyEmail);

authRoute.post('/send-email-verification', 
    auth(EUserRole.DEVELOPER, EUserRole.MANAGER),
    validate(authValidation.resendVerificationEmail), 
    authController.resendVerificationEmail);

authRoute.post('/reset-token', 
    auth(EUserRole.DEVELOPER, EUserRole.MANAGER), 
    validate(authValidation.refreshTokens), 
    authController.refreshTokens);

authRoute.post('/forgot-password', 
    auth(EUserRole.DEVELOPER, EUserRole.MANAGER), 
    validate(authValidation.forgotPassword), 
    authController.forgotPassword);
    
authRoute.patch('/update-password', 
    auth(EUserRole.DEVELOPER, EUserRole.MANAGER), 
    validate(authValidation.resetPassword), 
    authController.resetPassword);

// Google authentication
authRoute.get('/google', passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
));
authRoute.get('/google-callback', passport.authenticate('google', {
    successRedirect: '/auth/google-success',
    failureRedirect: '/auth/google-failure'
}));
authRoute.get('/google-success', authController.googleAuth);
authRoute.get('/google-failure', () => {
    throw new ApiError(httpStatus.UNAUTHORIZED, '⛔ Authentication failed!');
});

export default authRoute;