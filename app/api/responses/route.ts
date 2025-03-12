import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Response from "@/app/models/Response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ResponseSummary from "@/app/interfaces/IResponseSummary";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify";
import User from "@/app/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    // Find all responses for the current user
    const responses = await Response.find({ user: session.user.email })
      .populate("question", "Banca Ano Instituicao Cargo Numero _id NotaMaxima")
      .populate("feedback", "grade evaluatedBy")
      .sort({ createdAt: -1 })
      .lean();

    const getEvaluator = async (
      email: string
    ): Promise<undefined | { name: string; email: string; image: string }> => {
      const evaluator = await User.findOne({
        email,
      });
      if (!evaluator) {
        return undefined;
      }
      return {
        name: evaluator.name,
        email: evaluator.email,
        image: evaluator.image,
      };
    };

    const getFormattedResponse = async (
      response: any
    ): Promise<ResponseSummary> => {
      let evaluator = undefined;

      if ((response.feedback as any)?.evaluatedBy) {
        evaluator = await getEvaluator((response.feedback as any).evaluatedBy);
      }

      const questionNumber = (response.question as any).Numero
        ? " - Questão " + String((response.question as any).Numero)
        : "";
      return {
        id: response._id.toString(),
        evaluator,
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
        maxGrade: (response.question as any).NotaMaxima || 10,
        ...(response.feedback && {
          grade: (response.feedback as any).grade,
        }),
      };
    };

    // Format the response data
    const formattedResponses: ResponseSummary[] = await Promise.all(
      responses.map(async (response) => {
        return await getFormattedResponse(response);
      })
    );

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

    await newResponse.save();

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
