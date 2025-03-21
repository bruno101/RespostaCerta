import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Mock data for user statistics
    const mockStats = {
      questionsAnswered: 12,
      commentsPosted: 8,
      timeSpentMinutes: 345, // 5h 45m
      currentStreak: 3,
      totalPoints: 185,
      level: 4,
      progressToNextLevel: 65,
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas do usuário" },
      { status: 500 }
    );
  }
}
