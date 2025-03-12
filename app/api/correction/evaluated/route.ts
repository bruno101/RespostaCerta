import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EvaluatedResponse from "@/app/interfaces/IEvaluatedResponse";
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
      {
        $lookup: {
          from: "feedbacks",
          localField: "feedback",
          foreignField: "_id",
          as: "feedback",
        },
      },
      {
        $unwind: "$feedback",
      },
    ]);

    // Format the response data
    const formattedResponses: EvaluatedResponse[] = responses
      .filter(
        (response) =>
          response.status !== "pending" &&
          response.feedback.evaluatedBy === session.user.email
      )
      .map((response) => {
        const questionNumber = response.question.Numero
          ? " - Questão " + String(response.question.Numero)
          : "";
        return {
          id: response._id.toString(),
          evaluatedAt: response.feedback.createdAt,
          grade: response.feedback.grade,
          questionId: response.question._id.toString(),
          subject: response.question.Disciplina,
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
          maxGrade: response.NotaMaxima,
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
