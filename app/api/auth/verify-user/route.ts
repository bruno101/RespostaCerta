import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token é obrigatório" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user with valid token
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    user.verified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Conta ativada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Ocorreu um erro ao ativar conta" },
      { status: 500 }
    );
  }
}