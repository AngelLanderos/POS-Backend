import express, {Request, Response} from "express";
import morgan from 'morgan';
import cors from 'cors';

import productRouter from "./routes/products.route";
import productCategoryRouter from "./routes/productCategories.route";
import printingRouter from "./routes/printing.routes";
import { printTicket } from "./controllers/printing.controller";
import TableRouter from "./routes/table.routes";
import OrderRouter from "./routes/order.routes";

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/products',productRouter);
app.use('/productCategories',productCategoryRouter);
app.use('/printing',printingRouter);
app.use('/tables',TableRouter);
app.use('/orders',OrderRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Word');
});

app.post("/api/print", async (req, res) => {
  try {
    await printTicket(req.body);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default app;