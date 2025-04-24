"use server";

import { connectToDatabase } from "@/lib/mongoose";
import ISelector from "../interfaces/ISelector";
import Question from "../models/Question";
import IQuestion from "../interfaces/IQuestion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Notebook from "../models/Notebook";
import { generateFindParameters } from "./searchQuestions";

async function fetchQuestionIds(
  selected: ISelector[],
  userEmail: string
): Promise<string[] | null> {
  try {
    const findObject = await generateFindParameters(selected, userEmail);
    const questions = await Question.find(findObject)
      .sort({ createdAt: -1 })
      .select("_id")
      .exec();
    if (questions === undefined || questions === null) {
      return null;
    }
    return questions.map((question) => question._id.toString());
  } catch (error) {
    console.error("Error searching questions:", error);
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
  title: string,
  userEmail?: string
): Promise<{ id: string } | { error: string }> {
  try {
    if (title === "") {
      return { error: "Título deve ser não vazio" };
    }
    let session;
    if (!userEmail) {
      session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return { error: "Autenticação Necessária" };
      }
    }

    const questionIds = await fetchQuestionIds(
      selected,
      userEmail || session?.user?.email || ""
    );
    if (questionIds === null) {
      return { error: "Erro filtrando questões" };
    }
    return await saveNotebook(
      questionIds,
      title,
      userEmail || session?.user?.email || ""
    );
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
}
