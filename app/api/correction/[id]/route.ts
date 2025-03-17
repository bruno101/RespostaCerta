import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DOMPurify from "isomorphic-dompurify";
import ResponseDetails from "@/app/interfaces/IResponseDetails";
import { sanitizationSettings } from "@/lib/sanitization";
import Response from "@/app/models/Response";
import IFeedback from "@/app/interfaces/IFeedback";
import User from "@/app/models/User";
import { connectToDatabase } from "@/lib/mongoose";
import Feedback from "@/app/models/Feedback";
import { sendEmail } from "@/lib/email";
import Question from "@/app/models/Question";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.user.role !== "admin" && session.user.role !== "corretor") {
      return NextResponse.json({ error: "Proibido" }, { status: 403 });
    }

    await connectToDatabase();

    const responseId = (await params).id;

    const response = await Response.findOne({
      _id: responseId,
    })
      .populate(
        "question",
        "TextoMotivador NotaMaxima Questao Banca Ano Instituicao Cargo Numero _id",
        Question
      )
      .populate("feedback", "grade comment createdAt evaluatedBy", Feedback)
      .sort({ createdAt: -1 })
      .lean();

    if (!response) {
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
    }

    const student = await User.findOne({
      email: response.user,
    });

    const formattedResponse: ResponseDetails = {
      id: response._id.toString(),
      content: response.content,
      status: response.status,
      createdAt: response.createdAt.toString(),
      question: {
        maxGrade: (response.question as any).NotaMaxima || 10,
        id: (response.question as any)._id.toString(),
        title:
          (response.question as any).Banca +
          " - " +
          (response.question as any).Ano +
          " - " +
          (response.question as any).Instituicao +
          " - " +
          (response.question as any).Cargo +
          ((response.question as any).Numero
            ? " - Questão " + String((response.question as any).Numero)
            : ""),
        content:
          "<div>" +
          ((response.question as any).TextoMotivador
            ? (response.question as any).TextoMotivador + "<br/>"
            : "") +
          (response.question as any).Questao.toString() +
          "</div>",
        banca: (response.question as any).Banca,
        ano: (response.question as any).Ano,
        instituicao: (response.question as any).Instituicao,
        cargo: (response.question as any).Cargo,
        questao: (response.question as any).Questao,
      },
      student: {
        name: student?.name || "",
        email: student?.email || "",
        image: student?.image,
      },
    };
    if (response.feedback) {
      const evaluator = await User.findOne({
        email: (response.feedback as any).evaluatedBy,
      });
      const feedback: IFeedback = {
        grade: (response.feedback as any).grade,
        comment: (response.feedback as any).comment,
        createdAt: (response.feedback as any).createdAt,
        evaluatedBy: {
          name: evaluator?.name || "",
          email: evaluator?.email || "",
          image: evaluator?.image,
        },
      };
      formattedResponse.feedback = feedback;
    }

    if (
      formattedResponse.status !== "pending" &&
      session.user.role !== "admin" &&
      formattedResponse.feedback &&
      session.user.email !== formattedResponse.feedback?.evaluatedBy.email
    ) {
      return NextResponse.json({ error: "Proibido" }, { status: 403 });
    }
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Error fetching response details:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes da resposta" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const responseId = (await params).id;
    const body = await request.json();
    const { grade, comment } = body;

    if (grade === undefined || !comment) {
      return NextResponse.json(
        { error: "Dados incompletos. Nota e comentário são obrigatórios." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existingFeedback = await Feedback.findOne({
      response: responseId,
    });
    if (existingFeedback) {
      return NextResponse.json(
        { error: "Um feedback já foi enviado para essa questão" },
        { status: 400 }
      );
    }

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedComment = DOMPurify.sanitize(comment, sanitizationSettings);
    const feedback = new Feedback({
      grade,
      comment: sanitizedComment,
      response: responseId,
      evaluatedBy: session?.user?.email,
    });

    const savedFeedback = await feedback.save();

    const updatedResponse = await Response.findOneAndUpdate(
      {
        _id: responseId,
      },
      {
        $set: {
          status: "graded",
          feedback: savedFeedback._id,
        },
      }
    );

    if (!updatedResponse) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    const responseUrl = `${process.env.NEXTAUTH_URL}/painel/questoes-respondidas/${updatedResponse.question}`;
    const emailContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Questão Corrigida</h2>
    <p>Olá,</p>
    <p>Uma das questões que você submeteu foi corrigida. Clique no link abaixo para acessar a correção:</p>
    <p>
      <a 
        href="${responseUrl}" 
        style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
      >
        Verificar correção.
      </a>
    </p>
    <p>Atenciosamente,<br>Equipe Resposta Certa</p>
  </div>`;

    await sendEmail({
      to: updatedResponse.user,
      subject: "Correção de Questão - Resposta Certa",
      html: emailContent,
    });

    return NextResponse.json({
      success: true,
      message: "Feedback enviado com sucesso",
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Erro ao enviar feedback" },
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

    // Check if user has permission to edit evaluations
    const userRole = (session.user as any).role;
    if (userRole !== "admin" && userRole !== "corretor") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
    }

    const responseId = (await params).id;
    const body = await request.json();
    const { grade, comment } = body;

    if (grade === undefined || !comment) {
      return NextResponse.json(
        { error: "Dados incompletos. Nota e comentário são obrigatórios." },
        { status: 400 }
      );
    }

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedComment = DOMPurify.sanitize(comment, sanitizationSettings);

    await connectToDatabase();
    const existingResponse = await Response.findOne({
      _id: responseId,
    });
    if (!existingResponse) {
      return NextResponse.json(
        { error: "Resposta não encontrado" },
        { status: 404 }
      );
    }
    const existingFeedback = await Feedback.findOne({
      _id: existingResponse.feedback,
    });
    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback não encontrado" },
        { status: 404 }
      );
    }
    if (
      session.user.role !== "admin" &&
      existingFeedback.evaluatedBy !== session.user.email
    ) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
    }

    let updateObject: { grade?: number; comment?: string } = {};
    if (grade) {
      updateObject.grade = grade;
    }
    if (comment) {
      updateObject.comment = sanitizedComment;
    }

    const updatedFeedback = await Feedback.findOneAndUpdate(
      {
        _id: existingResponse.feedback,
      },
      { $set: updateObject }
    );

    const responseUrl = `${process.env.NEXTAUTH_URL}/painel/questoes-respondidas/${existingResponse.question}`;
    const emailContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Questão Corrigida</h2>
    <p>Olá,</p>
    <p>A correção de uma das questões que você submeteu foi atualizada. Clique no link abaixo para acessar a correção:</p>
    <p>
      <a 
        href="${responseUrl}" 
        style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
      >
        Verificar correção.
      </a>
    </p>
    <p>Atenciosamente,<br>Equipe Resposta Certa</p>
  </div>`;

    await sendEmail({
      to: existingResponse.user,
      subject: "Correção de Questão - Resposta Certa",
      html: emailContent,
    });

    if (updatedFeedback) {
      return NextResponse.json({
        success: true,
        message: "Feedback atualizado com sucesso",
        feedback: {
          grade: updatedFeedback.grade,
          comment: updatedFeedback.comment,
          createdAt: updatedFeedback.createdAt,
          evaluatedBy: {
            name: session.user.name,
            image: session.user.image,
            email: session.user.email,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar feedback" },
      { status: 500 }
    );
  }
}
