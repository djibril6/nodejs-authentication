import express from 'express';
import { Request, Response } from 'express';
import { authController } from '../controllers';
import { validate } from '../middlewares';
import { authValidation } from '../validations';

const authRoute = express.Router();

authRoute.post('/register',  validate(authValidation.register), authController.register);

// authRoute.get('/verify-email/:token', async (req: Request, res: Response) => {
//   authController.verifyEmail(req, res);
// });

export default authRoute;