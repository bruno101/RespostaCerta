import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/app/models/Question";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import IQuestion from "@/app/interfaces/IQuestion";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Connect to the database
    await connectToDatabase();
    const p = await params;
    const { code } = p;

    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    const q = await Question.findById(code).lean();
    if (!q) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    const question: IQuestion = {
      Codigo: q._id.toString(), // 👈 Convert ObjectId to string
      Disciplina: q.Disciplina,
      Banca: q.Banca,
      Ano: q.Ano,
      Nivel:
        q.Nivel === "Fundamental" ||
        q.Nivel === "Médio" ||
        q.Nivel === "Superior"
          ? q.Nivel
          : "Superior",
      Numero: q.Numero ? String(q.Numero) : "1",
      Instituicao: q.Instituicao,
      Cargos: q.Cargos,
      TextoMotivador: DOMPurify.sanitize(
        q.TextoMotivador,
        sanitizationSettings
      ),
      Questao: DOMPurify.sanitize(q.Questao, sanitizationSettings),
      Criterios: DOMPurify.sanitize(q.Criterios || "", sanitizationSettings),
      Resposta: DOMPurify.sanitize(q.Resposta || "", sanitizationSettings),
      TextoPlano: q.TextoPlano,
      Dificuldade: q.Dificuldade || 6,
      Modalidades: q.Modalidades || [],
      NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
    };

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// PUT route to update a question by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Validate the ID format
    if (!isValidObjectId(code)) {
      return NextResponse.json(
        { error: "Invalid question ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userRole = session?.user?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        {
          error: "Insufficient permissions. Only admins can create questions.",
        },
        { status: 403 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await request.json();
    const {
      Codigo,
      Disciplina,
      Banca,
      Ano,
      Nivel,
      Numero,
      Instituicao,
      Cargos,
      TextoMotivador,
      Questao,
      Criterios,
      Resposta,
      TextoPlano,
      Dificuldade,
      NotaMaxima,
      Modalidades,
    } = body;

    const newBody = {
      Disciplina: Disciplina,
      Banca: Banca,
      Ano: Ano,
      Nivel: Nivel,
      Instituicao: Instituicao,
      Numero: Numero || 1,
      Cargos: Cargos,
      TextoMotivador: DOMPurify.sanitize(TextoMotivador, sanitizationSettings),
      Questao: DOMPurify.sanitize(Questao, sanitizationSettings),
      Criterios: DOMPurify.sanitize(Criterios, sanitizationSettings),
      Resposta: DOMPurify.sanitize(Resposta, sanitizationSettings),
      TextoPlano: TextoPlano,
      Dificuldade: Dificuldade,
      EmailCriador: session?.user?.email,
      NotaMaxima: NotaMaxima,
      Modalidades: Modalidades || [],
    };

    // Find and update the question
    const updatedQuestion = await Question.findByIdAndUpdate(
      code,
      { $set: newBody },
      { new: true, runValidators: true }
    );

    // Check if question exists
    if (!updatedQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Return the updated question
    return NextResponse.json({ ...updatedQuestion, Codigo: code });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation Error", details: validationErrors },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE route to delete a question by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Validate the ID format
    if (!isValidObjectId(code)) {
      return NextResponse.json(
        { error: "Invalid question ID format" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userRole = session?.user?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        {
          error: "Insufficient permissions. Only admins can create questions.",
        },
        { status: 403 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(code);

    // Check if question exists
    if (!deletedQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Return success message
    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
