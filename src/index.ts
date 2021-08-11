import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use('*', cors());

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}`)
})