import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth.route';
import { config } from './config';
import './middlewares/custom_passport';

const app = express();

app.use(cors());
app.use('*', cors());

app.use('/auth', authRoute);

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`)
})