import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Response from "@/app/models/Response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ResponseSummary from "@/app/interfaces/ResponseSummary";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    // Find all responses for the current user
    const responses = await Response.find({ user: session.user.email })
      .populate("question", "Banca Ano Instituicao Cargo Numero _id")
      .populate("feedback", "grade")
      .sort({ createdAt: -1 })
      .lean();

    // Format the response data
    const formattedResponses: ResponseSummary[] = responses.map((response) => {
      const questionNumber = (response.question as any).Numero
        ? " - Questão " + String((response.question as any).Numero)
        : "";
      return {
        id: response._id.toString(),
        questionId: (response.question as any)._id.toString(),
        questionTitle:
          (response.question as any).Banca +
          " - " +
          (response.question as any).Ano +
          " - " +
          (response.question as any).Instituicao +
          " - " +
          (response.question as any).Cargo +
          questionNumber,
        status: response.status,
        createdAt: response.createdAt,
        ...(response.feedback && {
          grade: (response.feedback as any).grade,
        }),
      };
    });

    console.log(formattedResponses);
    return NextResponse.json(formattedResponses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Erro ao buscar respostas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, content } = body;

    if (!questionId || !content) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const sanitizedContent = DOMPurify.sanitize(content, sanitizationSettings);

    await connectToDatabase();

    // Check if user already has a response for this question
    const existingResponse = await Response.findOne({
      user: session.user.email,
      question: questionId,
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: "Você já enviou uma resposta para esta questão" },
        { status: 400 }
      );
    }

    // Create new response
    const newResponse = new Response({
      content: sanitizedContent,
      user: session.user.email,
      question: questionId,
      status: "pending",
    });
    console.log(newResponse);

    await newResponse.save();

    console.log("here")

    return NextResponse.json(
      {
        response: newResponse,
        message: "Resposta enviada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { error: "Erro ao enviar resposta" },
      { status: 500 }
    );
  }
}
