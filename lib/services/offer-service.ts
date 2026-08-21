import {
  getOfferById,
  saveOffer,
  updateOffer as updateOfferRepository,
  deleteOffer as deleteOfferRepository,
} from "@/lib/repositories/offer-repository";
import type { Offer } from "@/types/backend";

export interface CreateOfferInput {
  farmerId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export async function createOffer(input: CreateOfferInput): Promise<Offer> {
  const now = new Date().toISOString();

  const newOffer: Offer = {
    id: `offer-${Date.now()}`,
    farmerId: input.farmerId,
    cropName: input.cropName,
    quantity: input.quantity,
    unit: input.unit,
    pricePerUnit: input.pricePerUnit,
    harvestDate: now,
    freshnessScore: 0,
    status: "ACTIVE",
    createdAt: now,
  };

  return await saveOffer(newOffer);
}

export async function getOffer(id: string): Promise<Offer | undefined> {
  return await getOfferById(id);
}

export async function updateOffer(
  id: string,
  updates: Partial<Offer>
): Promise<Offer | undefined> {
  return await updateOfferRepository(id, updates);
}

export async function deleteOffer(id: string): Promise<boolean> {
  return await deleteOfferRepository(id);
}