"use server";

import Question from "@/app/models/Question";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";

export async function fetchUsers() {
  await connectToDatabase();
  const session = await getServerSession();
  let data = [];
  data = await Question.find({
    EmailCriador: session?.user?.email,
  });
  let mappedData: any[] = [];
  if (data) {
    mappedData = data.map((q) => ({
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
  }
  return JSON.stringify(mappedData);
}
