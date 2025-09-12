import { Response, Request } from "express";
import { printTicket } from "./printing.controller";
import { BarTablesEntity } from "../entities/table";
import { AppDataSource } from "../data-source";

const TableRepository = AppDataSource.getRepository(BarTablesEntity);

const AccountController = {
  createProvitionalAccount: async (req: Request, res: Response) => {
    try {
      const { order } = req.body;

      console.log(order);

      const updateResponse = await TableRepository.increment(
        { table_number: order.table }, // condición
        "provisionaltotal", // campo a actualizar
        order.total // cantidad a sumar
      );

      ///TODO: Imprimir correctamente

    //   await printTicket(order.products);

      return res.status(200).json("Orden creada correctamente");
    } catch (error) {
      return res.status(500).json("Error");
    }
  },

  provitionalPayment: async (req: Request, res: Response) => {
    try {
      const { tableNumber,payment } = req.body;

      console.log(tableNumber,payment);

      const updateResponse = await TableRepository.decrement(
        { table_number: tableNumber }, // condición
        "provisionaltotal", // campo a actualizar
        payment // cantidad a sumar
      );

      ///TODO: Imprimir correctamente

    //   await printTicket(order.products);

      return res.status(200).json("Pago procesado correctamente");
    } catch (error) {
      return res.status(500).json("Error");
    }
  },
};

export default AccountController;
