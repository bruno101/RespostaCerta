// app/api/create-subscription/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = "https://api-sandbox.asaas.com/v3";

// Helper function to validate credit card number using Luhn algorithm
function isValidCreditCardNumber(cardNumber: string): boolean {
  const cleanedCardNumber = cardNumber.replace(/\D/g, ""); // Remove non-numeric characters
  if (
    !cleanedCardNumber ||
    cleanedCardNumber.length < 13 ||
    cleanedCardNumber.length > 19
  ) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < cleanedCardNumber.length; i++) {
    let digit = parseInt(cleanedCardNumber.charAt(i), 10);
    if ((cleanedCardNumber.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

// Helper function to validate expiration date
function isValidExpirationDate(month: string, year: string): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
  return true;
}

// Helper function to validate CPF/CNPJ
function isValidCPFCNPJ(cpfCnpj: string): boolean {
  const cleanedCpfCnpj = cpfCnpj.replace(/\D/g, ""); // Remove non-numeric characters
  if (cleanedCpfCnpj.length === 11) {
    // Validate CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cleanedCpfCnpj.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cleanedCpfCnpj.charAt(10))) return false;
  } else if (cleanedCpfCnpj.length === 14) {
    // Validate CNPJ
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cleanedCpfCnpj.charAt(12))) return false;

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cleanedCpfCnpj.charAt(13))) return false;
  } else {
    return false;
  }

  return true;
}

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
    console.log("Falha ao buscar usuário no banco de dados", e);
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

  console.log("Salvando", response.data.id);
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
