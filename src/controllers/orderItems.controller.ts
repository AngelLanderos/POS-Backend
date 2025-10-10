import { Response, Request } from "express";
import { OrderItem } from "../entities/orderItems";
import { AppDataSource } from "../data-source";

const OrderItemRepository = AppDataSource.getRepository(OrderItem);

const OrderItemController = {
  getOrderItems: async (req: Request, res: Response) => {
    try {
      const { tableId } = req.body;

      if (tableId == null) {
        return res
          .status(400)
          .json({ error: "Se requiere tableId en el body" });
      }

      // asegúrate de parsear a number si viene como string
      const tid = Number(tableId);

      const items = await OrderItemRepository.createQueryBuilder("a")
        .innerJoin("products", "b", "a.product_id = b.product_id")
        .innerJoin("orders", "c", "a.order_id = c.order_id")
        .where("a.is_paid = false")
        .select([
          "b.name AS name",
          "a.quantity AS quantity",
          "a.unit_price AS unit_price",
          "c.table_id AS table_id",
          "a.order_item_id AS order_item_id",
          "a.paid_quantity AS paid_quantity",
        ])
        .getRawMany();

        console.log(items);
      return res.status(200).json(items);
    } catch (error) {
      console.error("getOrderItems error:", error);
      return res.status(500).json({ error: "Error al obtener order items" });
    }
  },
};

export default OrderItemController;
