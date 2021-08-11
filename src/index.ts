import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use('*', cors());

app.get('/',
    (req, res) => {
        res.send("req.user.profile");
    }
);

app.listen(3000, () => {
    console.log(`Server listening on port ${3000}`)
})