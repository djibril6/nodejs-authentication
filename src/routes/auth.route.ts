import express from 'express';
import { Request, Response } from 'express';
import { authController } from '../controllers';
import { validate } from '../middlewares';
import { authValidation } from '../validations';

const authRoute = express.Router();

authRoute.post('/register',  validate(authValidation.register), authController.register);
authRoute.post('/email-login',  validate(authValidation.loginWithEmail), authController.loginWithEmail);
authRoute.post('/tel-login',  validate(authValidation.loginWithTel), authController.loginWithTel);
authRoute.post('/logout', validate(authValidation.logout), authController.logout);

// authRoute.get('/verify-email/:token', async (req: Request, res: Response) => {
//   authController.verifyEmail(req, res);
// });

export default authRoute;