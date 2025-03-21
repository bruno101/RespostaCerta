// app/api/asaas-webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import { sendEmail } from "@/lib/email";
import welcomeToPremium from "@/utils/emails/welcome-to-premium";
import subscriptionCanceled from "@/utils/emails/subscription-canceled";

const ASAAS_WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET; // Store your webhook secret in .env

export async function POST(request: Request) {
  const body = await request.text();
  const token = request.headers.get("asaas-access-token");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  if (token !== ASAAS_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        error: "Invalid signature",
        sentToken: token,
        expectedToken: ASAAS_WEBHOOK_SECRET,
      },
      { status: 401 }
    );
  }

  /*// Verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", ASAAS_WEBHOOK_SECRET || "")
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }*/

  // Process the webhook event
  const event = JSON.parse(body);

  switch (event.event) {
    case "PAYMENT_CONFIRMED":
      console.log("Payment Confirmed:", event.payment);
      try {
        connectToDatabase();
        const subscriptionId = event.payment.subscription;
        const user = await User.findOne({ subscriptionId });
        if (!user) {
          return NextResponse.json(
            {
              error: "Subscrição não encontrada",
            },
            { status: 404 }
          );
        }
        user.subscription = "premium";
        const res = await user.save();
        if (!res) {
          throw new Error("");
        }
        const message = welcomeToPremium(user.name);
        sendEmail({
          to: user.email,
          subject: "Bem-vindo ao Resposta Certa Premium",
          html: message,
        });
        return NextResponse.json({ success: true }, { status: 200 });
      } catch (e) {
        return NextResponse.json(
          {
            error: "Erro atualizando status da subscrição no banco de dados",
          },
          { status: 500 }
        );
      }
      break;
    case "SUBSCRIPTION_CANCELED":
      console.log("canceled");
      try {
        connectToDatabase();
        const subscriptionId = event.payment.subscription;
        const user = await User.findOne({ subscriptionId });
        if (!user) {
          return NextResponse.json(
            {
              error: "Subscrição não encontrada",
            },
            { status: 404 }
          );
        }
        user.subscription = "free";
        user.subscriptionId = undefined;
        const res = await user.save();
        if (!res) {
          throw new Error("");
        }
        const message = subscriptionCanceled(user.name);
        sendEmail({
          to: user.email,
          subject: "Cancelamento de Assinatura - Resposta Certa",
          html: message,
        });
        return NextResponse.json({ success: true }, { status: 200 });
      } catch (e) {
        return NextResponse.json(
          {
            error: "Erro atualizando status da subscrição no banco de dados",
          },
          { status: 500 }
        );
      }
      break;
    default:
      console.log("Unhandled Event:", event.event);
  }

  return NextResponse.json({ success: true });
}
