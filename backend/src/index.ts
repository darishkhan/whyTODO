import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import todoRouter from './routes/todoRoutes';
import authorizationMiddleware from './todoMiddleware';
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/todo', todoRouter);

app.listen(port, ()=>{
    console.log("listening on port", port);
});
