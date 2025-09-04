import express, {Request, Response} from "express";
import morgan from 'morgan';
import cors from 'cors';

import productRouter from "./routes/products.route";

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use('/products',productRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Word');
});

export default app;