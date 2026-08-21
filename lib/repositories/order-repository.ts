import { pool } from "@/lib/db/mysql";
import type { Order } from "@/types/backend";

export async function getAllOrders(): Promise<Order[]> {
  const [rows] = await pool.query("SELECT * FROM orders");
  return rows as Order[];
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
  const results = rows as Order[];
  return results[0];
}

export async function saveOrder(order: Order): Promise<Order> {
  await pool.query(
    `INSERT INTO orders (id, offerId, vendorId, quantity, totalAmount, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id,
      order.offerId,
      order.vendorId,
      order.quantity,
      order.totalAmount,
      order.status,
      order.createdAt,
    ]
  );
  return order;
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | undefined> {
  const existing = await getOrderById(id);
  if (!existing) {
    return undefined;
  }

  const merged = { ...existing, ...updates };

  await pool.query(
    `UPDATE orders SET offerId=?, vendorId=?, quantity=?, totalAmount=?, status=?, createdAt=? WHERE id=?`,
    [
      merged.offerId,
      merged.vendorId,
      merged.quantity,
      merged.totalAmount,
      merged.status,
      merged.createdAt,
      id,
    ]
  );

  return merged;
}