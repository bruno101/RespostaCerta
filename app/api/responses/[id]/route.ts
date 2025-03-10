import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Response from "@/app/models/Response";
import Question from "@/app/models/Question";
import User from "@/app/models/User";
import Feedback from "@/app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const p = await params;
    const questionId = p.id;

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Find the response and populate related data
    const response = await Response.findOne({
      question: questionId,
      user: session.user.email,
    })
      .populate({
        path: "question",
        select: "Banca Ano Instituicao Cargo Questao",
        model: Question,
      })
      .populate({
        path: "feedback",
        model: Feedback,
        populate: {
          path: "evaluatedBy",
          select: "name image",
          model: User,
        },
      })
      .lean();

    if (!response) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    // Format the response data
    const formattedResponse = {
      id: response._id.toString(),
      content: response.content,
      status: response.status,
      createdAt: response.createdAt,
      question: {
        id: (response.question as any)._id.toString(),
        title:
          (response.question as any).Banca +
          " - " +
          (response.question as any).Ano +
          " - " +
          (response.question as any).Instituicao +
          " - " +
          (response.question as any).Cargo,
        content: (response.question as any).Questao,
      },
      ...(response.feedback && {
        feedback: {
          grade: (response.feedback as any).grade,
          comment: (response.feedback as any).comment,
          createdAt: (response.feedback as any).createdAt,
          /*TBD evaluatedBy: {
            name: (response.feedback as any).evaluatedBy.name,
            image: (response.feedback as any).evaluatedBy.image,
          },*/
        },
      }),
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Error fetching response:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados da resposta" },
      { status: 500 }
    );
  }
}
