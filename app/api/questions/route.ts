import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/app/models/Question";

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all questions from the database
    const questions = await Question.find();

    const mappedQuestions = questions.map((q) => ({
      Codigo: q._id.toString(), // 👈 Convert ObjectId to string
      Disciplina: q.Disciplina,
      Banca: q.Banca,
      Ano: q.Ano,
      Nivel: q.Nivel,
      Instituicao: q.Instituicao,
      Cargo: q.Cargo,
      TextoMotivador: q.TextoMotivador,
      Questao: q.Questao,
      Criterios: q.Criterios,
      Resposta: q.Resposta,
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
