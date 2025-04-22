import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import forgotPassword from "@/utils/emails/forgot-password";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email é obrigatório" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the user
    const user = await User.findOne({ email: email });

    // Even if user doesn't exist, return success to prevent email enumeration
    if (!user || (user && user.signedUpWithGoogle)) {
      return NextResponse.json(
        { message: "Se o email existir, enviaremos um link de recuperação" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send email
    const res = await sendEmail({
      to: user.email,
      subject: "Redefinição de Senha - Resposta Certa",
      html: forgotPassword(resetUrl),
    });
    console.log("sending response:", res);

    return NextResponse.json(
      { message: "Se o email existir, enviaremos um link de recuperação" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao processar sua solicitação" },
      { status: 500 }
    );
  }
}
