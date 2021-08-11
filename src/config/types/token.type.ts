import mongoose from 'mongoose';

export interface tokenInterface extends mongoose.Document {
    token: string;
    user: string | (() => string);
    type: string;
    expires: Date;
    blacklisted: boolean;
}

export enum ETokenType {
    ACCESS = 'access',
    REFRESH = 'refresh',
    RESET_PASSWORD = 'resetPassword',
    VERIFY_EMAIL = 'verifyEmail',
}
