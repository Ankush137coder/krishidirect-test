
import { NextResponse } from "next/server";

import {
  createPayment,
  getPayments,
} from "@/lib/services/payment-service";

import {
  validateCreatePayment,
} from "@/lib/validation/payment-validation";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: getPayments(),
      error: null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          "Unable to fetch payments",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const validation =
      validateCreatePayment(
        body
      );

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            validation.error,
        },
        { status: 400 }
      );
    }

    const result =
      createPayment(
        validation.data
      );

    if (!result.success) {
      const status =
        result.error ===
        "Order not found"
          ? 404
          : 409;

      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            result.error,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.payment,
        error: null,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          "Invalid JSON request body",
      },
      { status: 400 }
    );
  }
}
