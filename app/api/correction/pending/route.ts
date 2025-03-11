import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PendingResponse from "@/app/interfaces/PendingResponse";
import { connectToDatabase } from "@/lib/mongoose";
import Response from "@/app/models/Response";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (session.user.role !== "admin" && session.user.role !== "corretor") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    /*
    // Mock data for pending responses
    const mockPendingResponses: PendingResponse[] = [
      {
        id: "resp3",
        questionTitle:
          "Discorra sobre os princípios constitucionais da administração pública",
        questionId: "q3",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        student: {
          id: "student1",
          name: "João Silva",
          image: "https://i.pravatar.cc/150?u=student1",
        },
      },
      {
        id: "resp4",
        questionTitle:
          "Analise o caso concreto sobre improbidade administrativa",
        questionId: "q4",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        student: {
          id: "student2",
          name: "Maria Oliveira",
          image: "https://i.pravatar.cc/150?u=student2",
        },
      },
      {
        id: "resp6",
        questionTitle: "Explique o princípio da presunção de inocência",
        questionId: "q6",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        student: {
          id: "student3",
          name: "Pedro Santos",
          image: "https://i.pravatar.cc/150?u=student3",
        },
      },
    ];*/

    await connectToDatabase();

    const responses = await Response.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $unwind: "$question",
      },
    ]);
    console.log("responses", responses);

    // Format the response data
    const formattedResponses: PendingResponse[] = responses
      .filter((response) => response.status === "pending")
      .map((response) => {
        const questionNumber = response.question.Numero
          ? " - Questão " + String(response.question.Numero)
          : "";
        return {
          id: response._id.toString(),
          questionId: response.question._id.toString(),
          questionTitle:
            response.question.Banca +
            " - " +
            response.question.Ano +
            " - " +
            response.question.Instituicao +
            " - " +
            response.question.Cargo +
            questionNumber,
          status: response.status,
          createdAt: response.createdAt,
          student: {
            email: response.student.email,
            name: response.student.name,
            image: response.student.image,
          },
        };
      });

    return NextResponse.json(formattedResponses);
  } catch (error) {
    console.error("Error fetching pending responses:", error);
    return NextResponse.json(
      { error: "Erro ao buscar respostas pendentes" },
      { status: 500 }
    );
  }
}
