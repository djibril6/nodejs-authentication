import mongoose from 'mongoose';
import { ETokenType, tokenInterface } from '../config/types';

const tokenSchema = new mongoose.Schema(
    {
      token: {
        type: String,
        required: true,
        index: true,
      },
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        enum: [ETokenType.REFRESH, ETokenType.RESET_PASSWORD, ETokenType.VERIFY_EMAIL],
        required: true,
      },
      expires: {
        type: Date,
        required: true,
      },
      blacklisted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
  
  /**
   * @typedef Token
   */
  const Token = mongoose.model<tokenInterface>('Token', tokenSchema);
  
  export default Token;
  