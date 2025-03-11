import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EvaluatedResponse from "@/app/interfaces/EvaluatedResponse";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (session.user.role !== "admin" && session.user.role !== "corretor") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    // Mock data for evaluated responses
    const mockEvaluatedResponses: EvaluatedResponse[] = [
      {
        id: "resp1",
        questionTitle: "Qual a diferença entre jurisdição e competência?",
        questionId: "q1",
        evaluatedAt: new Date(
          Date.now() - 13 * 24 * 60 * 60 * 1000
        ).toISOString(), // 13 days ago
        grade: 8,
        maxGrade: 10,
        student: {
          email: "student4",
          name: "Ana Souza",
          image: "https://i.pravatar.cc/150?u=student4",
        },
      },
      {
        id: "resp2",
        questionTitle: "Explique o princípio da separação dos poderes",
        questionId: "q2",
        evaluatedAt: new Date(
          Date.now() - 8 * 24 * 60 * 60 * 1000
        ).toISOString(), // 8 days ago
        grade: 9,
        maxGrade: 10,
        student: {
          email: "student5",
          name: "Lucas Ferreira",
          image: "https://i.pravatar.cc/150?u=student5",
        },
      },
      {
        id: "resp7",
        questionTitle:
          "Discorra sobre o controle de constitucionalidade no Brasil",
        questionId: "q7",
        evaluatedAt: new Date(
          Date.now() - 4 * 24 * 60 * 60 * 1000
        ).toISOString(), // 4 days ago
        grade: 7,
        maxGrade: 10,
        student: {
          email: "student6",
          name: "Juliana Costa",
          image: "https://i.pravatar.cc/150?u=student6",
        },
      },
    ];

    return NextResponse.json(mockEvaluatedResponses);
  } catch (error) {
    console.error("Error fetching evaluated responses:", error);
    return NextResponse.json(
      { error: "Erro ao buscar respostas avaliadas" },
      { status: 500 }
    );
  }
}
