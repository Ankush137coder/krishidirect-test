
import type {
  PaymentMethod,
} from "@/types/backend";

const allowedMethods: PaymentMethod[] = [
  "UPI",
  "CARD",
  "BANK_TRANSFER",
  "PAY_ON_PICKUP",
];

export function validateCreatePayment(
  body: unknown
):
  | {
      valid: true;
      data: {
        orderId: string;
        method: PaymentMethod;
      };
    }
  | {
      valid: false;
      error: string;
    } {
  if (
    typeof body !== "object" ||
    body === null
  ) {
    return {
      valid: false,
      error: "Request body must be an object",
    };
  }

  const data = body as Record<
    string,
    unknown
  >;

  if (
    typeof data.orderId !== "string" ||
    data.orderId.trim() === ""
  ) {
    return {
      valid: false,
      error: "orderId is required",
    };
  }

  if (
    typeof data.method !== "string" ||
    !allowedMethods.includes(
      data.method as PaymentMethod
    )
  ) {
    return {
      valid: false,
      error:
        "method must be UPI, CARD, BANK_TRANSFER, or PAY_ON_PICKUP",
    };
  }

  return {
    valid: true,
    data: {
      orderId: data.orderId,
      method: data.method as PaymentMethod,
    },
  };
}

