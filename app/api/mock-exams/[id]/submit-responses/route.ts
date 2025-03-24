import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import UserExam from "@/app/models/UserExam";
import { sanitizationSettings } from "@/lib/sanitization";
import DOMPurify from "isomorphic-dompurify";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const userResponseArray: string[] = [];
    const gradeArray: number[] = [];
    const commentArray: string[] = [];
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    await connectToDatabase();
    const userExamData = await UserExam.findOne({
      email: session.user.email,
      exam_id: id,
    });
    if (userExamData) {
      return NextResponse.json(
        { error: "Respostas já submetidas" },
        { status: 400 }
      );
    }
    let feedbacks: Record<number, { grade: number; comment: string }> = {};

    const {
      responses,
    }: {
      responses: { question: string; userResponse: string; maxGrade: number }[];
    } = await req.json();
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "Array não vazia responses é obrigatória" },
        { status: 400 }
      );
    }
    responses.forEach((response) => {
      const { question, userResponse, maxGrade } = response;
      if (!maxGrade) {
        response.maxGrade = 10;
      }
      userResponseArray.push(userResponse);
      if (typeof maxGrade != "number") {
        return NextResponse.json(
          { error: "maxGrade deve ser número" },
          { status: 400 }
        );
      }
      if (
        userResponse === undefined ||
        userResponse === null ||
        typeof userResponse != "string"
      ) {
        return NextResponse.json(
          { error: "string userResponse é obrigatória" },
          { status: 400 }
        );
      }
      if (!question || typeof question != "string") {
        return NextResponse.json(
          { error: "string question é obrigatória" },
          { status: 400 }
        );
      }
    });
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    await Promise.all(
      responses.map(async ({ question, userResponse, maxGrade }, index) => {
        const prompt = `Considere a questão a seguir: [início]***"${question}"***[fim]. 
        Considere a resposta a seguir: [início]***"${userResponse}"***[fim].
        Dê uma nota de 0 a ${maxGrade} para essa resposta. Se a resposta for perfeita e não puder ser melhorada, dê ${maxGrade}. Se a resposta for vazia ou fugir completamente do tema, dê 0.
        Escreva um comentário justificando essa nota e dando feedback para o usuário que submeteu a resposta. Considere aspectos como corretude, completude, precisão, clareza e domínio da língua portuguesa.
        Na sua resposta, o(s) primeiro(s) caracteres devem ser a nota, seguidos de um "-"; isto é, inicie a resposta com a nota, seguida de "-". Os caracteres restantes devem ser o comentário.`;

        const result = await model.generateContent(prompt);
        if (result && result.response) {
          const generatedText = result.response.text();
          const sainitizedText = DOMPurify.sanitize(
            generatedText,
            sanitizationSettings
          );
          const [first, ...rest] = sainitizedText.split("-");
          feedbacks = {
            ...feedbacks,
            [index + 1]: {
              grade: +first || 0,
              comment: rest.join("-"),
            },
          };
        }
      })
    );
    for (const key in feedbacks) {
      gradeArray.push(feedbacks[key].grade);
      commentArray.push(feedbacks[key].comment);
    }
    const userExam = new UserExam({
      user: session.user.email,
      exam_id: id,
      responses: userResponseArray,
      grades: gradeArray,
      comments: commentArray,
    });
    const data = await userExam.save();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 500 });
  }
}
