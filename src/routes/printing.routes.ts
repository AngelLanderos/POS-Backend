import {Router} from 'express';
import { printTicket } from '../controllers/printing.controller';


const printingRouter = Router();

printingRouter.post('/print',printTicket);

export default printingRouter;
const printerInterface = "printer:POS-58 Printer";