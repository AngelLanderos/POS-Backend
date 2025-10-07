import { Response, Request } from "express";
import { printTicket } from "./printing.controller";
import { BarTablesEntity } from "../entities/table";
import { DailyTotal } from "../entities/dairly_total";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/orderItems";
import { AppDataSource } from "../data-source";

const TableRepository = AppDataSource.getRepository(BarTablesEntity);
const OrderRepository = AppDataSource.getRepository(Order);
const OrderItemRepository = AppDataSource.getRepository(OrderItem);
const DailyTotalRepository = AppDataSource.getRepository(DailyTotal);


const OrderController = {
createNewOrder: async (req: Request, res: Response) => {
  try {
    const {order} = req.body;

    console.log(order.products);
    // Actualiza la mesa en la BD

    //TODO Calcular el total de la mesa con respecto a las ordenes
    await TableRepository.increment(
      { table_number: order.table },
      "provisionalTotal",
      order.total
    );

    //TODO Para la mesa, crear una orden y crear los registros de order items

    const newOrder = OrderRepository.create({
      status: 'Open',
      created_at: new Date(),
      table_id: order.table
    });

    const saveOrder = await newOrder.save();
    // { name: 'Shot Sauza', price: '70', size: 'large', quantity: 1 }

    for(let i = 0; i < order.products.length; i++){
      let product = order.products[i];
      
      let newOrderItem = OrderItemRepository.create({
        quantity: product.quantity,
        unit_price: product.price,
        discount: 0,
        notes: '',
        created_at: new Date(),
        order_id:saveOrder.order_id,
        product_id: product.id
      })

      await newOrderItem.save();
    };
    
    // Enviar TODO el objeto al script de Python 
    // await printTicket({ products: order.products,total: order.total, table: order.table });
  
    return res.status(200).json("Orden creada correctamente");
    
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al crear la orden");
  }
},


  provitionalPayment: async (req: Request, res: Response) => {
    try {
      const { tableNumber,payment } = req.body;

      console.log(tableNumber,payment);

      const updateResponse = await TableRepository.decrement(
        { table_number: tableNumber }, // condición
        "provisionalTotal", // campo a actualizar
        payment // cantidad a sumar
      );

     await DailyTotalRepository.increment(
      {}, "total", payment
     );

     console.log(1);
      // TODO: Imprimir correctamente

      await printTicket({total: payment});

      return res.status(200).json("Pago procesado correctamente");
    } catch (error) {
      return res.status(500).json("Error");
    }
  },
};

export default OrderController;
