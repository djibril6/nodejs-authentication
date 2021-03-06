import { Model } from 'mongoose';

export interface IEmail { email?: string; }
export interface ITel { tel?: string; }
export interface IPassword { password?: string; }
export interface IRole { role?: EUserRole; }
export interface IRefreshToken { refreshToken?: string; }
export interface IIsEmailVerified { isEmailVerified?: boolean; }
export interface IRegisteredWith { registeredWith?: string; }
export interface IThirdPartyID { thirdPartyID?: string; }

export enum EUserRole {
    MANAGER = 'manager',
    DEVELOPER = 'developer'
}

export interface IUserModel extends Model<IUserDocument> {
    isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>;
    isTelTaken?: (tel: string, excludeUserId?: string) => Promise<boolean>;
}

export interface IUserDocument extends 
IEmail, IPassword, ITel, IRole, IIsEmailVerified, IRegisteredWith, IThirdPartyID {
    isPasswordMatch?: (password: string) => Promise<boolean>;
}

export interface IEmailLoginInput extends IEmail, IPassword {};
export interface ITelLoginInput extends ITel, IPassword {};
export interface IRegistrationInput extends ITel, IPassword, IEmail, IRole {};
export interface ILogoutInput extends IRefreshToken {};
export interface IRefreshTokenInput extends IRefreshToken {};
export interface IForgotPasswordInput extends IEmail {};
export interface IResetPasswordInput {
    oldPassword?: string;
    newPassword?: string;
};
export interface IVerifyEmailInput {
    token: string;
};
export interface IUserDataInput extends 
    IEmail, 
    IRole, 
    IIsEmailVerified, 
    IRegisteredWith, 
    IThirdPartyID {}