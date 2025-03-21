// app/api/asaas-webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import { sendEmail } from "@/lib/email";
import welcomeToPremium from "@/utils/emails/welcome-to-premium";
import subscriptionCanceled from "@/utils/emails/subscription-canceled";

const ASAAS_WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET; // Store your webhook secret in .env
const ALLOWED_IPS = [
  "52.67.12.206",
  "18.230.8.159",
  "54.94.136.112",
  "54.94.183.101",
  "54.232.48.115",
];

export async function POST(request: Request) {
  // Get the client's IP address from the x-forwarded-for header
  const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0].trim();

  // Check if the client's IP is in the allowed list
  if (!clientIP || !ALLOWED_IPS.includes(clientIP)) {
    // Block the request if the IP is not allowed
    return NextResponse.json(
      {
        error: "Access denied",
      },
      { status: 403 }
    );
  }

  const body = await request.text();
  const token = request.headers.get("asaas-access-token");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  if (token !== ASAAS_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        error: "Invalid token",
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
        await sendEmail({
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
    case "SUBSCRIPTION_DELETED":
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
        console.log(res);
        if (!res) {
          return NextResponse.json(
            {
              error: "Erro atualizando subscrição no banco de dados",
            },
            { status: 500 }
          );
        }
        const message = subscriptionCanceled(user.name);
        await sendEmail({
          to: user.email,
          subject: "Cancelamento de Assinatura - Resposta Certa",
          html: message,
        });
        return NextResponse.json({ success: true }, { status: 200 });
      } catch (e) {
        console.error(e);
        return NextResponse.json(
          {
            error: "Erro cancelando subscrição",
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
