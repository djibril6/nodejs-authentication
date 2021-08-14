import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieSession from 'cookie-session'
import { authRoute, docRoute } from './routes';
import { config } from './config';
import './middlewares/custom_passport';

const app = express();

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));

app.use(cookieSession({
    name: 'facebook-auth-session',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use('*', cors());

app.use(express.json());

app.use('/auth', authRoute);
app.use('/doc', docRoute);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    app.listen(config.port, () => {
        console.log(`🚀 Server listening on port ${config.port}`);
    });
});