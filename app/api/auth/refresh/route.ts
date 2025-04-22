// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { verifyToken, generateToken, generateRefreshToken } from "@/lib/token";

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    // Verify refresh token
    const decoded = await verifyToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newAccessToken = generateToken(decoded.email);
    const newRefreshToken = generateRefreshToken(decoded.email);

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
