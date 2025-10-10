import { Request, Response } from "express";
import { Payments } from "../entities/payment";
import { PaymentAllocation } from "../entities/paymentAllocation";
import { AppDataSource } from "../data-source";
import { BarTablesEntity } from "../entities/table";
import { DailyTotal } from "../entities/dairly_total";
import { OrderItem } from "../entities/orderItems";


const PaymentRepository = AppDataSource.getRepository(Payments);
const PaymentAllocationRepository = AppDataSource.getRepository(PaymentAllocation);
const TableRepository = AppDataSource.getRepository(BarTablesEntity)
const DailyTotalRepository = AppDataSource.getRepository(DailyTotal);
const OrderItemRepository = AppDataSource.getRepository(OrderItem)


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

        // 2) Validar cantidades contra lo ya pagado (consultar payments_allocation sum dentro de la tx)
        for (const a of allocations) {
          const oi = items.find((it) => it.order_item_id === a.order_item_id)!;

          // suma pagada previa (en la misma tx)
          const paidSums = await trx
            .getRepository(PaymentAllocation)
            .createQueryBuilder("pa")
            .select("COALESCE(SUM(pa.quantity),0)", "paid_qty")
            .addSelect("COALESCE(SUM(pa.amount),0)", "paid_amt")
            .where("pa.order_item_id = :id", { id: oi.order_item_id })
            .getRawOne();

          const alreadyPaidQty = Number(paidSums.paid_qty || 0);
          const remainingQty = Number(oi.quantity || 0) - alreadyPaidQty;
          const requestedQty = Number(a.quantity || 0);

          if (requestedQty <= 0) {
            throw new Error(`Invalid quantity for order_item ${oi.order_item_id}`);
          }

          if (requestedQty > remainingQty) {
            throw new Error(
              `Requested quantity (${requestedQty}) exceeds remaining (${remainingQty}) for order_item ${oi.order_item_id}`
            );
          }
        }

        // 3) Crear payment (inicial amount 0, lo actualizamos luego)
        const paymentEntity = trx.getRepository(Payments).create({
          order_id: null,
          amount: 0, // lo recalculamos
          method: payment.method,
        //   reference: payment.reference ?? null,
          paid_at: new Date(),
        });
        const savedPayment = await trx.getRepository(Payments).save(paymentEntity);

        // 4) Crear allocations, recalculando amount server-side (unit_price * qty [+ modifiers])
        const allocEntities: PaymentAllocation[] = [];
        let totalAmount = 0;

        for (const a of allocations) {
          const oi = items.find((it) => it.order_item_id === a.order_item_id)!;

          // calcular lineAmount (si tienes modifiers/discounts inclúyelos aquí)
          const unitPrice = Number(oi.unit_price ?? 0);
          const qty = Number(a.quantity ?? 0);
          const lineAmount = Number((unitPrice * qty).toFixed(2)); // redondeo simple

          totalAmount += lineAmount;

          const alloc = trx.getRepository(PaymentAllocation).create({
            payment_id: savedPayment.payment_id,
            order_item_id: oi.order_item_id,
            quantity: qty,
            amount: lineAmount,
            created_at: new Date(),
          });

          allocEntities.push(alloc);
        }

        const savedAllocations = await trx
          .getRepository(PaymentAllocation)
          .save(allocEntities);

        // 5) Actualizar el monto total del payment
        savedPayment.amount = Number(totalAmount.toFixed(2));
        await trx.getRepository(Payments).save(savedPayment);

        // 6) Actualizar paid_quantity y paid_amount por cada order_item y setear is_paid cuando corresponda
        // Recalcular desde payments_allocation (fuente de la verdad)
        const affectedOrderIds = [...new Set(items.map((i) => i.order_id))];
        const affectedItemIds = [...new Set(items.map((i) => i.order_item_id))];

        for (const itemId of affectedItemIds) {
          const sums = await trx
            .getRepository(PaymentAllocation)
            .createQueryBuilder("pa")
            .select("COALESCE(SUM(pa.quantity),0)", "paid_qty")
            .addSelect("COALESCE(SUM(pa.amount),0)", "paid_amt")
            .where("pa.order_item_id = :id", { id: itemId })
            .getRawOne();

          const paidQty = Number(sums.paid_qty || 0);
          const paidAmt = Number(sums.paid_amt || 0);

          // obtener la fila original para comparaciones
          const oi = items.find((it) => it.order_item_id === itemId)!;
          const totalLineAmount = Number((Number(oi.unit_price || 0) * Number(oi.quantity || 0)).toFixed(2));

          const isFullyPaid : boolean = paidQty >= Number(oi.quantity || 0) || paidAmt >= totalLineAmount;

          await trx.getRepository(OrderItem).update(
            { order_item_id: itemId },
            {
              paid_quantity: paidQty,
              paid_amount: paidAmt,
              is_paid: isFullyPaid,
            }
          );
        }

        // 7) Actualizar provisionalTotal de la mesa (decrementar por el monto cobrado)
        // Asegúrate que la columna y la condición coinciden con tu entidad BarTablesEntity
        console.log({totalAmount});
        await trx.getRepository(BarTablesEntity).decrement(
          { id: table_id },
          "provisionalTotal",
          totalAmount
        );

        // 8) Incrementar daily total
        // Asumo que tienes exactamente una fila en daily_total; si no, ajusta la condición
        await trx.getRepository(DailyTotal).increment({}, "total", totalAmount);

        // 9) (Opcional) actualizar orders: por cada order afectada, verificar si se debe cerrar
        for (const oid of affectedOrderIds) {
          // calcular total order
          const orderTotalRow = await trx
            .getRepository(OrderItem)
            .createQueryBuilder("oi")
            .select("COALESCE(SUM(oi.unit_price * oi.quantity), 0)", "order_total")
            .where("oi.order_id = :oid", { oid })
            .getRawOne();

          const allocatedRow = await trx
            .getRepository(PaymentAllocation)
            .createQueryBuilder("pa")
            .select("COALESCE(SUM(pa.amount), 0)", "allocated")
            .innerJoin("order_items", "oi", "oi.order_item_id = pa.order_item_id")
            .where("oi.order_id = :oid", { oid })
            .getRawOne();

          const orderTotal = Number(orderTotalRow.order_total || 0);
          const allocated = Number(allocatedRow.allocated || 0);

          if (allocated >= orderTotal) {
            // marcar orden cerrada
            await trx.getRepository("orders").update(
              { order_id: oid },
              { status: "closed", closed_at: new Date() }
            );
          }
        }

        return {
          payment: savedPayment,
          allocations: savedAllocations,
        };
      });

      // responder con el resultado
      return res.status(201).json({
        message: "Payment created successful",
        payment: result.payment,
        allocations: result.allocations,
      });
    } catch (error) {
      console.error("Error in paySelected:", error);
      return res.status(500).json({ message: "Internal server error", detail: String(error) });
    }
  },
};

export default PaymentController;
