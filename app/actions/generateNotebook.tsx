"use server";

import { connectToDatabase } from "@/lib/mongoose";
import ISelector from "../interfaces/ISelector";
import Question from "../models/Question";
import IQuestion from "../interfaces/IQuestion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Notebook from "../models/Notebook";

async function fetchQuestionIds(
  selected: ISelector[]
): Promise<string[] | null> {
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
      if (
        selector.name !== "Palavras Chave" &&
        selector.name !== "Resolvidas" &&
        selector.options.length > 0
      ) {
        const orArray: {}[] = [];
        for (let option of selector.options) {
          const newObject: any = {};
          newObject[selector.name] = option;
          orArray.push(newObject);
        }
        findObject.$and.push({ $or: orArray });
      } else if (selector.name === "Resolvidas") {
        //tbd
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
    const questions = await Question.find(findObject)
      .sort({ createdAt: -1 })
      .select("_id")
      .exec();
    if (questions === undefined || questions === null) {
      return null;
    }
    return questions.map((question) => question._id.toString());
  } catch (error) {
    console.error("Error usearching questions:", error);
    return null;
  }
}

export async function saveNotebook(
  questionIds: string[],
  title: string,
  email: string
): Promise<{ id: string } | { error: string }> {
  try {
    const newNotebook = {
      title,
      user: email,
      questions: questionIds,
      currentQuestion: 0,
    };

    const createdNotebook = await Notebook.create(newNotebook);
    if (createdNotebook._id) {
      return { id: createdNotebook._id.toString() };
    }
    return { error: "Internal Server Error" };
  } catch (e) {
    console.error(e);
    return { error: "Internal Server Error" };
  }
}

export async function generateNotebook(
  selected: ISelector[],
  title: string
): Promise<{ id: string } | { error: string }> {
  try {
    if (title === "") {
      return { error: "Título deve ser não vazio" };
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Autenticação Necessária" };
    }
    const questionIds = await fetchQuestionIds(selected);
    if (questionIds === null) {
      return { error: "Erro filtrando questões" };
    }
    return await saveNotebook(questionIds, title, session.user.email);
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
}
