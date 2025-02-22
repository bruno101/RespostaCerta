import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/app/models/Question";

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
    const question = {
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
