// app/api/asaas-webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const ASAAS_WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET; // Store your webhook secret in .env

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("asaas-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  // Verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", ASAAS_WEBHOOK_SECRET || "")
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Process the webhook event
  const event = JSON.parse(body);

  switch (event.event) {
    case "PAYMENT_CONFIRMED":
      console.log("Payment Confirmed:", event.payment);
      // Update user's subscription status in your database
      break;
    case "SUBSCRIPTION_CANCELED":
      console.log("Subscription Canceled:", event.payment);
      // Update user's subscription status in your database
      break;
    default:
      console.log("Unhandled Event:", event.event);
  }

  return NextResponse.json({ success: true });
}
