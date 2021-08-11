import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { IUserDocument, IUserModel, EUserRole } from '../config/types';

  
const userSchema = new Schema<IUserDocument, IUserModel>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        tel: {
            type: String,
            required: false,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value: string) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
            },
        },
        role: {
            type: String,
            enum: {...EUserRole},
            default: EUserRole.DEVELOPER,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        registeredWith: {
            type: String,
        },
        thirdPartyID: {
            type: String,
        },
    },
);
userSchema.static('isEmailTaken', async function isEmailTaken(email: string, excludeUserId: string) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
});

userSchema.static('isTelTaken', async function isTelTaken(tel: string, excludeUserId: string) {
    const user = await this.findOne({ tel, _id: { $ne: excludeUserId } });
    return !!user;
});

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.get('password'));
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const hashedPass = await bcrypt.hash(user.get('password'), 8);
        user.set('password', hashedPass);
    }
    next();
});
  
const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
