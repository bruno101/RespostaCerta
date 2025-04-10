"use server";

import { connectToDatabase } from "@/lib/mongoose";
import ISelector from "../interfaces/ISelector";
import Question from "../models/Question";
import IQuestion from "../interfaces/IQuestion";
import Response from "../models/Response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Schema } from "mongoose";
import { Types } from "mongoose";

export async function searchQuestions(
  selected: ISelector[],
  questionsPerPage: number,
  pageNumber: number
): Promise<
  | { questions: IQuestion[]; totalDocuments: number; totalPages: number }
  | undefined
> {
  try {
    const session = await getServerSession(authOptions);

    const page = Math.max(1, pageNumber || 1);
    const limit = Math.max(1, questionsPerPage || 5);
    const skip = (page - 1) * limit;
    selected.map((selector) => {
      if (selector.name === "Instituição") {
        selector.name = "Instituicao";
      } else if (selector.name === "Nível") {
        selector.name = "Nivel";
      } else if (selector.name === "Cargo") {
        selector.name = "Cargos";
      } else if (selector.name === "Modalidade") {
        selector.name = "Modalidades";
      }
      return selector;
    });
    await connectToDatabase();
    let findObject: any = { $and: [] };
    let solved = "";
    for (let selector of selected) {
      if (
        selector.name !== "Palavras Chave" &&
        selector.name !== "Resolvidas" &&
        selector.name !== "Dificuldade" &&
        selector.options.length > 0
      ) {
        const orArray: {}[] = [];
        for (let option of selector.options) {
          const newObject: any = {};
          newObject[selector.name] = option;
          orArray.push(newObject);
        }
        findObject.$and.push({ $or: orArray });
      } else if (selector.name === "Dificuldade") {
        let min = 1,
          max = 10;
        const option = selector.options[0];
        if (option === "Fácil") {
          (min = 1), (max = 5);
        }
        if (option === "Média") {
          (min = 6), (max = 7);
        }
        if (option === "Difícil") {
          (min = 8), (max = 10);
        }
        findObject.$and.push({ Dificuldade: { $gte: min, $lte: max } });
      } else if (selector.name === "Resolvidas") {
        solved = selector.options[0];
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

    if (!(solved === "") && session?.user?.email) {
      const responseIds: string[] = (
        await Response.find({ user: session.user.email }, { question: 1 })
      ).map((r) => r.question.toString());

      if (solved === "y") {
        findObject.$and.push({
          _id: { $in: responseIds },
        });
      } else if (solved === "n") {
        findObject.$and.push({
          _id: { $nin: responseIds },
        });
      }
    }

    const questions = await Question.find(findObject)
      .sort({ Ano: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalDocuments = await Question.countDocuments(findObject);

    const totalPages = Math.ceil(totalDocuments / limit);
    const mappedQuestions: IQuestion[] = questions.map((q) => ({
      Codigo: q._id.toString(),
      Disciplina: q.Disciplina,
      Banca: q.Banca,
      Ano: q.Ano,
      Nivel: (q.Nivel === "Fundamental" ||
      q.Nivel === "Médio" ||
      q.Nivel === "Superior"
        ? q.Nivel
        : "Superior") as "Fundamental" | "Médio" | "Superior",
      Numero: String(q.Numero),
      Instituicao: q.Instituicao,
      Cargos: q.Cargos,
      TextoMotivador: q.TextoMotivador,
      Questao: q.Questao,
      Criterios: q.Criterios || "",
      Resposta: q.Resposta || "",
      TextoPlano: q.TextoPlano,
      Dificuldade: q.Dificuldade || 6,
      NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
      EmailCriador: q.EmailCriador,
      Modalidades: q.Modalidades || [],
    }));
    return { questions: mappedQuestions, totalDocuments, totalPages };
  } catch (error) {
    console.error("Error usearching questions:", error);
    return;
  }
}
