import { Request,Response } from "express"
import { Payments } from "../entities/payment";
import { PaymentAllocation } from "../entities/paymentAllocation";
import { AppDataSource } from "../data-source";

const PaymentRepository = AppDataSource.getRepository(Payments);
const PaymentAllocationRepository = AppDataSource.getRepository(PaymentAllocation);

const PaymentController = {

    paySelected: async (req: Request , res: Response) => {
        try {
            const {table_id, payment, allocations} = req.body.payload;
            
            // console.log(req.body);
            console.log(payment);

            const newPayment = PaymentRepository.create({
                order_id: null,
                amount: payment.amount,
                method: payment.method,
                paid_at: new Date()
            });

            //TODO Guardar pago 
            await newPayment.save()
            console.log({newPayment});

            //TODO Almacenar locations
            for(const allocation of allocations) {

                const newAllocation = PaymentAllocationRepository.create({
                    amount: allocation.amount,
                    created_at: new Date(),
                    order_item_id: allocation.order_item_id,
                    payment_id: newPayment.payment_id
                });

                await newAllocation.save();
            }

            return res.status(201).json({
                message: 'Payment created succesfull'
            })

        } catch (error) {
            console.log('Error', error);
            return res.status(500).json({message: 'Internal server error'});
        }
    },
};

export default PaymentController;