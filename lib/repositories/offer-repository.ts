import { pool } from "@/lib/db/mysql";
import type { Offer } from "@/types/backend";

export async function getAllOffers(): Promise<Offer[]> {
  const [rows] = await pool.query("SELECT * FROM offers");
  return rows as Offer[];
}

export async function getOfferById(id: string): Promise<Offer | undefined> {
  const [rows] = await pool.query("SELECT * FROM offers WHERE id = ?", [id]);
  const results = rows as Offer[];
  return results[0];
}

export async function saveOffer(offer: Offer): Promise<Offer> {
  await pool.query(
    `INSERT INTO offers (id, farmerId, cropName, quantity, unit, pricePerUnit, harvestDate, freshnessScore, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      offer.id,
      offer.farmerId,
      offer.cropName,
      offer.quantity,
      offer.unit,
      offer.pricePerUnit,
      offer.harvestDate,
      offer.freshnessScore,
      offer.status,
      offer.createdAt,
    ]
  );
  return offer;
}

export async function updateOffer(
  id: string,
  updates: Partial<Offer>
): Promise<Offer | undefined> {
  const existing = await getOfferById(id);
  if (!existing) {
    return undefined;
  }

  const merged = { ...existing, ...updates };

  await pool.query(
    `UPDATE offers SET farmerId=?, cropName=?, quantity=?, unit=?, pricePerUnit=?, harvestDate=?, freshnessScore=?, status=?, createdAt=? WHERE id=?`,
    [
      merged.farmerId,
      merged.cropName,
      merged.quantity,
      merged.unit,
      merged.pricePerUnit,
      merged.harvestDate,
      merged.freshnessScore,
      merged.status,
      merged.createdAt,
      id,
    ]
  );

  return merged;
}

export async function deleteOffer(id: string): Promise<boolean> {
  const [result] = await pool.query("DELETE FROM offers WHERE id = ?", [id]);
  const info = result as { affectedRows: number };
  return info.affectedRows > 0;
}