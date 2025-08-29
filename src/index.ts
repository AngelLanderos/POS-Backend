import express, {Request, Response} from "express";
import "reflect-metadata";
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.listen(3000,() => {
    console.log('Server listen on http://localhost:3000');
});
