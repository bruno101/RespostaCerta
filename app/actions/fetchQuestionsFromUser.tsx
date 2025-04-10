"use server";

import Question from "@/app/models/Question";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import IQuestion from "@/app/interfaces/IQuestion";

export async function fetchQuestionsFromUser() {
  await connectToDatabase();
  const session = await getServerSession();
  let data = [];
  data = await Question.find({
    EmailCriador: session?.user?.email,
  });
  let mappedData: IQuestion[] = [];
  if (data) {
    mappedData = data.map((q) => ({
      Codigo: q._id.toString(), // 👈 Convert ObjectId to string
      Disciplina: q.Disciplina,
      Banca: q.Banca,
      Ano: q.Ano,
      Nivel:
        q.Nivel === "Fundamental" ||
        q.Nivel === "Médio" ||
        q.Nivel === "Superior"
          ? q.Nivel
          : ("Superior" as "Fundamental" | "Médio" | "Superior"),
      Numero: String(q.Numero),
      Instituicao: q.Instituicao,
      Cargos: q.Cargos,
      TextoMotivador: q.TextoMotivador,
      Questao: q.Questao,
      Criterios: q.Criterios,
      Resposta: q.Resposta || "",
      TextoPlano: q.TextoPlano,
      Dificuldade: q.Dificuldade || 6,
      NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
      EmailCriador: q.EmailCriador,
      Modalidades: q.Modalidades || [],
    }));
  }
  return JSON.stringify(mappedData);
}
