import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/app/models/Question";
import IQuestion from "@/app/interfaces/IQuestion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify";

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all questions from the database
    const questions = await Question.find();

    const mappedQuestions: IQuestion[] = questions.map((q) => ({
      Codigo: q._id.toString(), // 👈 Convert ObjectId to string
      Disciplina: q.Disciplina,
      Banca: q.Banca,
      Ano: q.Ano,
      Nivel: q.Nivel,
      Numero: String(q.Numero),
      Instituicao: q.Instituicao,
      Cargo: q.Cargo,
      TextoMotivador: q.TextoMotivador,
      Questao: q.Questao,
      Criterios: q.Criterios,
      Resposta: q.Resposta,
      TextoPlano: q.TextoPlano,
      Dificuldade: q.Dificuldade,
      NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
    }));

    return NextResponse.json(mappedQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    // Connect to the database
    await connectToDatabase();

    const userRole = session?.user?.role;
    if (userRole !== "admin") {
      return NextResponse.json(
        {
          error: "Insufficient permissions. Only admins can create questions.",
        },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    delete body.Codigo;
    body.EmailCriador = session?.user?.email;
    // Create a new question
    const newQuestion = new Question(body);
    const q = await newQuestion.save();
    const question: IQuestion = {
      Codigo: q._id.toString(), // 👈 Convert ObjectId to string
      Disciplina: q.Disciplina,
      Banca: q.Banca,
      Ano: q.Ano,
      Nivel: q.Nivel,
      Numero: String(q.Numero),
      Instituicao: q.Instituicao,
      Cargo: q.Cargo,
      TextoMotivador: DOMPurify.sanitize(
        q.TextoMotivador,
        sanitizationSettings
      ),
      Questao: DOMPurify.sanitize(q.Questao, sanitizationSettings),
      Criterios: DOMPurify.sanitize(q.Criterios, sanitizationSettings),
      Resposta: DOMPurify.sanitize(q.Resposta, sanitizationSettings),
      TextoPlano: q.TextoPlano,
      Dificuldade: q.Dificuldade,
      NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
    };

    // Return the created question
    return NextResponse.json(question, { status: 201 });
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
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
