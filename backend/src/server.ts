import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import userRouter from './routers/user.routes';
import workshopRouter from './routers/workshop.routes';
import commentRouter from './routers/comments.routes';
import messageRouter from './routers/messages.routes';

import * as path from 'path';

// Setting up app
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serving static files
app.use("/src/images", express.static(path.join("src/images")));  

// Setting up MongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/piaproject');
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('db connection ok')
})

// Connecting app with its routers
const router = express.Router();
router.use('/users', userRouter);
router.use('/workshops', workshopRouter);
router.use('/comments', commentRouter);
router.use('/messages', messageRouter);


app.use('/', router);


app.listen(4000, () => console.log(`Express server running on port 4000`));