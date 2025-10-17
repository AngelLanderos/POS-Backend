import { Request, Response } from "express";
import { Payments } from "../entities/payment";
import { PaymentAllocation } from "../entities/paymentAllocation";
import { AppDataSource } from "../data-source";
import { BarTablesEntity } from "../entities/table";
import { DailyTotal } from "../entities/dairly_total";
import { OrderItem } from "../entities/orderItems";
import { Order } from "../entities/order";
import { printTicket } from "./printing.controller";
import { ChildEntity } from "typeorm";

const PaymentController = {
  paySelected: async (req: Request, res: Response) => {
  try {
    const { table_id, payment, allocations } = req.body.payload ?? req.body;

    // basic payload validation
    if (!payment || !Array.isArray(allocations) || allocations.length === 0) {
      return res.status(400).json({ message: "Payload inválido" });
    }

    // Ejecutar en transacción
    const result = await AppDataSource.manager.transaction(async (trx) => {
      // 1) Recolectar order_item_ids y bloquear las filas
      const itemIds = allocations.map((a: any) => a.order_item_id);

      const items = await trx
        .getRepository(OrderItem)
        .createQueryBuilder("oi")
        .whereInIds(itemIds)
        .setLock("pessimistic_write") // SELECT ... FOR UPDATE
        .getMany();

      // Validar que todos los order_items existan
      const missing = itemIds.filter(
        (id: number) => !items.find((it) => it.order_item_id === id)
      );

      if (missing.length) {
        throw new Error(`Order items not found: ${missing.join(",")}`);
      }

      // 1.b) Validar que las órdenes de los items pertenezcan a la mesa indicada
      const affectedOrderIds = [...new Set(items.map((i) => i.order_id))];

      if (affectedOrderIds.length > 0) {
        const orders = await trx
          .getRepository("orders")
          .createQueryBuilder("o")
          .whereInIds(affectedOrderIds)
          .getMany();

        const wrong = (orders as any[]).filter(
          (o: any) => Number(o.table_id) !== Number(table_id)
        );
        if (wrong.length > 0) {
          throw new Error(
            `Some order items belong to orders of other tables. Table mismatch detected.`
          );
        }
      }

      // 3) Crear payment
      const paymentEntity = trx.getRepository(Payments).create({
        order_id: null,
        amount: 0,
        method: payment.method,
        // reference: payment.reference ?? null,
        paid_at: new Date(),
      });

      const savedPayment = await trx
        .getRepository(Payments)
        .save(paymentEntity);

      // 4) Crear allocations y calcular totalAmount
      const allocaionEntities: PaymentAllocation[] = [];
      let totalAmount = 0;

      for (const a of allocations) {
        const oi = items.find((it) => it.order_item_id === a.order_item_id)!;
        const unitPrice = Number(oi.unit_price ?? 0);
        const qty = Number(a.quantity ?? 0);
        const lineAmount = Number((unitPrice * qty).toFixed(2));
        totalAmount += lineAmount;

        const alloc = trx.getRepository(PaymentAllocation).create({
          payment_id: savedPayment.payment_id,
          order_item_id: oi.order_item_id,
          quantity: qty,
          amount: lineAmount,
          created_at: new Date(),
        });

        allocaionEntities.push(alloc);
      }

      const savedAllocations = await trx
        .getRepository(PaymentAllocation)
        .save(allocaionEntities);

      // 5) Actualizar el monto total del payment
      savedPayment.amount = Number(totalAmount.toFixed(2));
      await trx.getRepository(Payments).save(savedPayment);

      // ---------------------
      // Optimización: obtener sums para todos los order_item_ids en UN solo query
      // ---------------------
      const paymentSum = await trx
        .getRepository(PaymentAllocation)
        .createQueryBuilder("pa")
        .select("pa.order_item_id", "order_item_id")
        .addSelect("COALESCE(SUM(pa.quantity),0)", "paid_qty")
        .addSelect("COALESCE(SUM(pa.amount),0)", "paid_amt")
        .where("pa.order_item_id IN (:...ids)", { ids: itemIds })
        .groupBy("pa.order_item_id")
        .getRawMany();

      const paymenyMap = new Map<
        number,
        { paid_qty: number; paid_amt: number }
      >();
      for (const r of paymentSum) {
        paymenyMap.set(Number(r.order_item_id), {
          paid_qty: Number(r.paid_qty || 0),
          paid_amt: Number(r.paid_amt || 0),
        });
      }

      // 6) Actualizar paid_quantity, paid_amount e is_paid para cada order_item (usando los sums ya obtenidos)
      const orderItemRepo = trx.getRepository(OrderItem);

      for (const oi of items) {
        const sums = paymenyMap.get(Number(oi.order_item_id)) ?? {
          paid_qty: 0,
          paid_amt: 0,
        };
        const paidQty = sums.paid_qty;
        const paidAmt = sums.paid_amt;
        const totalLineAmount = Number(
          (Number(oi.unit_price || 0) * Number(oi.quantity || 0)).toFixed(2)
        );
        const isFullyPaid =
          paidQty >= Number(oi.quantity || 0) || paidAmt >= totalLineAmount;

        await orderItemRepo.update(
          { order_item_id: oi.order_item_id },
          {
            paid_quantity: paidQty,
            paid_amount: paidAmt,
            is_paid: isFullyPaid,
          }
        );
      }

      //Actualizar estatus de orden
      const itemsPendingToPaidCount = await trx
        .getRepository(OrderItem)
        .createQueryBuilder("a")
        .innerJoin("orders", "b", "a.order_id = b.order_id")
        .where("a.is_paid = :paid", { paid: false })
        .andWhere("b.table_id = :table_id", { table_id })
        .getCount(); // ejecuta la consulta dentro de la tx

      if (itemsPendingToPaidCount == 0) {
        await trx.getRepository(BarTablesEntity).update({ id: table_id }, { status: 'free' });
      } 

      // Actualizar provisionalTotal de la mesa
      await trx
        .getRepository(BarTablesEntity)
        .decrement({ id: table_id }, "provisionalTotal", totalAmount);

      // Incrementar daily total
      await trx.getRepository(DailyTotal).increment({}, "total", totalAmount);

      return {
        payment: savedPayment,
        allocations: savedAllocations,
      };
    });

    //TODO Imprimir ticket de pago


    // responder con el resultado
    return res.status(201).json({
      message: "Payment created successful",
      payment: result.payment,
      allocations: result.allocations,
    });

  } catch (error) {
    console.error("Error in paySelected:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", detail: String(error) });
  }
},

};

export default PaymentController;
