// app/api/create-subscription/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import isValidCPFCNPJ from "@/utils/validation/is-valid-cpf-cnpj";
import isValidCreditCardNumber from "@/utils/validation/is-valid-credit-card-number";
import isValidExpirationDate from "@/utils/validation/is-valid-expiration-date";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = "https://api-sandbox.asaas.com/v3";

export async function POST(request: Request) {
  // Get the session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const {
    customerId,
    cardNumber,
    expiryMonth,
    expiryYear,
    ccv,
    holderName,
    cpfCnpj,
    postalCode,
    addressNumber,
    phone,
  } = await request.json();

  // Validate inputs
  if (!customerId || typeof customerId !== "string") {
    return NextResponse.json(
      { error: "ID do cliente é obrigatório" },
      { status: 400 }
    );
  }

  if (
    !cardNumber ||
    typeof cardNumber !== "string" ||
    !isValidCreditCardNumber(cardNumber)
  ) {
    return NextResponse.json(
      { error: "Número do cartão inválido" },
      { status: 400 }
    );
  }

  if (
    !expiryMonth ||
    !expiryYear ||
    !isValidExpirationDate(expiryMonth, expiryYear)
  ) {
    return NextResponse.json(
      { error: "Data de expiração inválida ou expirada" },
      { status: 400 }
    );
  }

  if (!ccv || typeof ccv !== "string" || ccv.length < 3 || ccv.length > 4) {
    return NextResponse.json({ error: "CVV inválido" }, { status: 400 });
  }

  if (
    !holderName ||
    typeof holderName !== "string" ||
    holderName.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Nome do titular do cartão é obrigatório" },
      { status: 400 }
    );
  }

  if (!cpfCnpj || typeof cpfCnpj !== "string" || !isValidCPFCNPJ(cpfCnpj)) {
    return NextResponse.json({ error: "CPF/CNPJ inválido" }, { status: 400 });
  }

  if (
    !postalCode ||
    typeof postalCode !== "string" ||
    postalCode.length !== 8
  ) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  if (
    !addressNumber ||
    typeof addressNumber !== "string" ||
    addressNumber.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Número do endereço é obrigatório" },
      { status: 400 }
    );
  }

  if (
    !phone ||
    typeof phone !== "string" ||
    phone.length < 10 ||
    phone.length > 11
  ) {
    return NextResponse.json({ error: "Telefone inválido" }, { status: 400 });
  }

  const email = session.user.email;

  try {
    connectToDatabase();
    const user = await User.findOne({ email });
    if (user?.subscriptionId) {
      return NextResponse.json(
        { error: "Usuário já possui subscrição" },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Falha na assinatura. Tente novamente." },
      { status: 500 }
    );
  }

  let response;

  try {
    // Create subscription in ASAAS
    response = await axios.post(
      `${ASAAS_API_URL}/subscriptions`,
      {
        customer: customerId,
        billingType: "CREDIT_CARD",
        value: 5.0,
        cycle: "MONTHLY",
        nextDueDate: new Date().toISOString().split("T")[0], // Dynamic due date (today)
        description: "Premium Subscription",
        creditCard: {
          holderName,
          number: cardNumber.replace(/\D/g, ""), // Remove non-numeric characters
          expiryMonth,
          expiryYear,
          ccv,
        },
        creditCardHolderInfo: {
          name: holderName,
          email: session.user.email, // Use the authenticated user's email
          cpfCnpj: cpfCnpj.replace(/\D/g, ""), // Remove non-numeric characters
          postalCode: postalCode.replace(/\D/g, ""), // Remove non-numeric characters
          addressNumber,
          phone: phone.replace(/\D/g, ""), // Remove non-numeric characters
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY,
        },
      }
    );
  } catch (error) {
    console.error(
      "Error creating subscription on ASAAS:",
      (error as any).response?.data
    );
    return NextResponse.json(
      { error: "Falha ao criar assinatura. Tente novamente." },
      { status: 500 }
    );
  }

  try {
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          subscriptionId: response.data.id,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    try {
      if (response?.data?.id) {
        await axios.delete(
          `${ASAAS_API_URL}/subscriptions/${response.data.id}`,
          {
            headers: { access_token: ASAAS_API_KEY },
          }
        );
      }
      return NextResponse.json(
        {
          error: "Falha ao criar assinatura. Tente novamente.",
        },
        { status: 500 }
      );
    } catch (error) {
      console.error("Erro salvando subscriptionId no banco de dados:", error);
      return NextResponse.json(
        {
          error:
            "Falha ao salvar subscriptionId no banco de dados. Por favor, entre em contato com o suporte.",
        },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  let user, subscriptionId;

  try {
    connectToDatabase();
    user = await User.findOne({
      email: session.user.email,
    });
    if (!user) {
      return NextResponse.json(
        { error: "Erro buscando usuário." },
        { status: 500 }
      );
    }
    if (!user.subscriptionId) {
      return NextResponse.json(
        { error: "Subscrição não encontrada." },
        { status: 404 }
      );
    }
    subscriptionId = user.subscriptionId;
  } catch (e) {
    return NextResponse.json(
      { error: "Erro buscando id da subscrição." },
      { status: 500 }
    );
  }

  // Validate subscriptionId
  if (!subscriptionId || typeof subscriptionId !== "string") {
    return NextResponse.json(
      { error: "Assinatura não encontrada." },
      { status: 404 }
    );
  }

  let response;
  try {
    // Cancel the subscription in ASAAS
    response = await axios.delete(
      `${ASAAS_API_URL}/subscriptions/${subscriptionId}`,
      {
        headers: { access_token: ASAAS_API_KEY },
      }
    );
  } catch (error) {
    console.error(
      "Error canceling subscription:",
      (error as any)?.response?.data
    );
    return NextResponse.json(
      { error: "Falha ao cancelar assinatura no ASAAS" },
      { status: 500 }
    );
  }

  try {
    user.subscription = "free";
    await user.save();
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Assinatura cancelada no ASAAS. Erro ao atualizar assinatura para free.",
      },
      { status: 500 }
    );
  }
}
