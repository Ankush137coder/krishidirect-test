
import { NextResponse } from "next/server";

import {
  getPayment,
  changePaymentStatus,
} from "@/lib/services/payment-service";

import type {
  PaymentStatus,
} from "@/types/backend";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses: PaymentStatus[] = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const payment =
      getPayment(id);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            "Payment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
      error: null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          "Unable to fetch payment",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const body =
      await request.json();

    if (
      typeof body.status !==
        "string" ||
      !allowedStatuses.includes(
        body.status as PaymentStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            "status must be PENDING, PROCESSING, PAID, FAILED, or REFUNDED",
        },
        { status: 400 }
      );
    }

    if (
      body.transactionId !==
        undefined &&
      typeof body.transactionId !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            "transactionId must be a string",
        },
        { status: 400 }
      );
    }

    const result =
      changePaymentStatus(
        id,
        body.status as PaymentStatus,
        body.transactionId
      );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            result.error,
        },
        {
          status:
            result.code ===
            "NOT_FOUND"
              ? 404
              : 409,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.payment,
      error: null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error:
          "Invalid request body",
      },
      { status: 400 }
    );
  }
}

