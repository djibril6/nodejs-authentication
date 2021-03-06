import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: '.env' });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    EMAIL_FROM: Joi.string().required().description('the from field in the emails sent by the app'),
    SENDGRID_API_KEY: Joi.string().required().description('Sendgrid api key required'),
    GOOGLE_CLIENT_ID: Joi.string().required().description('Google auth client ID required'),
    GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google auth client secret required'),
    FACEBOOK_APP_ID: Joi.string().required().description('Facebook app ID required'),
    FACEBOOK_SECRET: Joi.string().required().description('Facebook auth client secret required'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  AWS_ACCESS_KEY: envVars.VERIFICATION_EMAIL_URL,
  AWS_SECRET_ACCESS_KEY: envVars.VERIFICATION_EMAIL_URL,
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
    sendgridAPIKey: envVars.SENDGRID_API_KEY
  },
  google: {
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET
  },
  facebook: {
    clientID: envVars.FACEBOOK_APP_ID,
    clientSecret: envVars.FACEBOOK_SECRET
  }
};
export default config;
