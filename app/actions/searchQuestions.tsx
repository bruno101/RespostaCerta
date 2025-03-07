"use server";

import { connectToDatabase } from "@/lib/mongoose";
import ISelector from "../interfaces/ISelector";
import Question from "../models/Question";
import IQuestion from "../interfaces/IQuestion";

export async function searchQuestions(
  selected: ISelector[]
): Promise<undefined | IQuestion[]> {
  try {
    selected.map((selector) => {
      if (selector.name === "Instituição") {
        selector.name = "Instituicao";
      } else if (selector.name === "Nível") {
        selector.name = "Nivel";
      }
      return selector;
    });
    await connectToDatabase();
    let findObject: any = { $and: [] };
    for (let selector of selected) {
      if (selector.name !== "Palavras Chave" && selector.options.length > 0) {
        const orArray: {}[] = [];
        for (let option of selector.options) {
          const newObject: any = {};
          newObject[selector.name] = option;
          orArray.push(newObject);
        }
        findObject.$and.push({ $or: orArray });
      } else {
        if (selector.options) {
          findObject.$and.push({
            $or: selector.options.map((keyword) => ({
              TextoPlano: { $regex: keyword, $options: "i" },
            })),
          });
        }
      }
    }
    const questions = await Question.find(findObject);
    const mappedQuestions: IQuestion[] = questions.map((q) => ({
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
      TextoPlano: q.TextoPlano,
      Dificuldade: q.Dificuldade,
    }));
    return mappedQuestions;
  } catch (error) {
    console.error("Error usearching questions:", error);
    return;
  }
}
