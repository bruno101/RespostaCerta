import INotebook from "@/app/interfaces/INotebook";
import IQuestion from "@/app/interfaces/IQuestion";
import Question from "@/app/models/Question";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }
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
    const notebooks: INotebook[] = [
      {
        id: "1",
        questions: mappedQuestions.slice(0, 2),
        title: "Meu Primeiro Caderno",
        currentQuestion: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        questions: mappedQuestions.slice(1, 5),
        title: "Meu Segundo Caderno",
        currentQuestion: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        questions: mappedQuestions.slice(1, 5),
        title: "Meu Terceiro Caderno",
        currentQuestion: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        questions: mappedQuestions.slice(1, 5),
        title: "Meu Quarto Caderno",
        currentQuestion: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return NextResponse.json(notebooks);
  } catch (error) {
    console.error("Error fetching notebooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch notebooks" },
      { status: 500 }
    );
  }
}
