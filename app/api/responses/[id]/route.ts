import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Response from "@/app/models/Response";
import Question from "@/app/models/Question";
import User from "@/app/models/User";
import Feedback from "@/app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify";

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
        select: "Banca Ano Instituicao Cargos Questao",
        model: Question,
      })
      .populate({
        path: "feedback",
        model: Feedback,
      })
      .lean();

    if (!response) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    let evaluatedBy = undefined;
    const evaluator = await User.findOne({
      email: (response.feedback as any)?.evaluatedBy,
    });
    if (evaluator) {
      evaluatedBy = {
        email: evaluator.email,
        name: evaluator.name,
        image: evaluator.image,
      };
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
          (response.question as any).Cargos[0] +
          ((response.question as any).Numero
            ? " - Questão " + String((response.question as any).Numero)
            : ""),
        content: (response.question as any).Questao,
      },
      ...(response.feedback && {
        feedback: {
          grade: (response.feedback as any).grade,
          comment: (response.feedback as any).comment,
          createdAt: (response.feedback as any).createdAt,
          evaluatedBy,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const questionId = (await params).id;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo da resposta é obrigatório" },
        { status: 400 }
      );
    }

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content, sanitizationSettings);
    await connectToDatabase();

    const updatedResponse = await Response.findOneAndUpdate(
      {
        user: session.user.email,
        question: questionId,
      },
      { $set: { content: sanitizedContent } },
      { new: true }
    );

    if (!updatedResponse) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResponse, { status: 200 });
  } catch (error) {
    console.error("Error updating response:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar resposta" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const questionId = (await params).id;

    const res = await Response.findOneAndDelete({
      user: session.user.email,
      question: questionId,
    });

    if (!res) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resposta excluída com sucesso",
    });
  } catch (error) {
    console.error("Error deleting response:", error);
    return NextResponse.json(
      { error: "Erro ao excluir resposta" },
      { status: 500 }
    );
  }
}
