// app/api/create-customer/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = "https://api-sandbox.asaas.com/v3";

// Helper function to validate CPF
function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove non-numeric characters
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Check length and repeated digits

  // Validate first checksum digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  // Validate second checksum digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Helper function to validate CNPJ
function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, ""); // Remove non-numeric characters
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false; // Check length and repeated digits

  // Validate first checksum digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;

  // Validate second checksum digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;

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

  const { name, cpfCnpj } = await request.json();
  const email = session.user.email;

  // Validate inputs
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Nome é obrigatório e deve ser uma string válida" },
      { status: 400 }
    );
  }

  if (!cpfCnpj || typeof cpfCnpj !== "string" || cpfCnpj.trim().length === 0) {
    return NextResponse.json(
      { error: "CPF/CNPJ é obrigatório e deve ser uma string válida" },
      { status: 400 }
    );
  }

  // Validate CPF/CNPJ format and checksum
  const cleanedCpfCnpj = cpfCnpj.replace(/[^\d]+/g, ""); // Remove non-numeric characters
  if (cleanedCpfCnpj.length === 11) {
    if (!isValidCPF(cleanedCpfCnpj)) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
    }
  } else if (cleanedCpfCnpj.length === 14) {
    if (!isValidCNPJ(cleanedCpfCnpj)) {
      return NextResponse.json({ error: "CNPJ inválido" }, { status: 400 });
    }
  } else {
    return NextResponse.json(
      { error: "CPF/CNPJ deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)" },
      { status: 400 }
    );
  }

  let response;

  try {
    connectToDatabase();
    const user = await User.findOne({ email });
    if (user?.customerId) {
      return NextResponse.json({ id: user.customerId });
    }
  } catch (e) {
    console.log("Falha ao buscar usuário no banco de dados", e);
    return NextResponse.json(
      { error: "Falha na assinatura. Tente novamente." },
      { status: 500 }
    );
  }
  try {
    console.log(`${ASAAS_API_URL}/customers`, {
      name,
      email,
      cpfCnpj: cleanedCpfCnpj, // Send cleaned CPF/CNPJ (without formatting)
    });
    // Create customer in ASAAS
    response = await axios.post(
      `${ASAAS_API_URL}/customers`,
      {
        name,
        email,
        cpfCnpj: cleanedCpfCnpj, // Send cleaned CPF/CNPJ (without formatting)
      },
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY,
        },
      }
    );
  } catch (error) {
    console.error("Error creating customer:", (error as any)?.response?.data);
    return NextResponse.json(
      { error: "Falha na assinatura. Tente novamente." },
      { status: 500 }
    );
  }

  console.log("Salvando", response.data.id);
  try {
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          customerId: response.data.id,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro salvando customerId no banco de dados:", error);
    return NextResponse.json(
      { error: "Falha na assinatura. Tente novamente." },
      { status: 500 }
    );
  }
}
