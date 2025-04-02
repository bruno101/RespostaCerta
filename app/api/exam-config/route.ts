import Exam from "@/app/models/Exam";
import Question from "@/app/models/Question";
import { authOptions } from "@/lib/auth";
import {
  generateEmbedding,
  generateEmbeddingForTemas,
} from "@/utils/embedding";
import generateExam from "@/utils/generateExam";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema
const examConfigSchema = z.object({
  dificuldade: z.number().min(1).max(3),
  numQuestions: z.number().min(1).max(5),
  timePerQuestion: z.number().min(1),
  selectedTemas: z.array(z.string()).nonempty(),
  cargo: z.string().nonempty(),
  examType: z.string().nonempty(),
});

interface IExamQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  timeLimit: number;
  points: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }
    const body = await request.json();

    // Validate input
    const validatedData = examConfigSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const temasEmbedding = await generateEmbeddingForTemas([
      ...body.selectedTemas,
    ]);

    const cargosEmbedding = await generateEmbedding(body.Cargo);

    // Find similar questions using vector search
    const similarQuestions = await Question.aggregate([
      {
        $vectorSearch: {
          index: "embedding_index", // Make sure you've created this index in MongoDB
          path: "Embedding",
          queryVector: temasEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 1,
          Disciplina: 1,
          Questao: 1,
          Dificuldade: 1,
          TextoMotivador: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        $match: {
          score: { $gt: 0.1 }, // Minimum similarity threshold
        },
      },
    ]);

    console.log(similarQuestions);

    if (similarQuestions.length === 0) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const questionsForSimilarCargos = await Question.aggregate([
      {
        $vectorSearch: {
          index: "embedding_index", // Make sure you've created this index in MongoDB
          path: "CargoEmbedding",
          queryVector: cargosEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 1,
          Disciplina: 1,
          Questao: 1,
          Dificuldade: 1,
          TextoMotivador: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        $match: {
          score: { $gt: 0.1 }, // Minimum similarity threshold
        },
      },
    ]);

    console.log(questionsForSimilarCargos);

    if (questionsForSimilarCargos.length === 0) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const questions: IExamQuestion[] = await generateExam(
      body.dificuldade,
      body.numQuestions,
      body.timePerQuestion,
      body.selectedTemas,
      body.cargo,
      body.examType,
      similarQuestions.map((q) => q.Questao),
      questionsForSimilarCargos.map((q) => q.Questao)
    );

    const newExam = new Exam({
      title: "Simulado Personalizado",
      disciplina: body.selectedTemas,
      cargo: body.cargo,
      concurso: "Nenhum concurso específico",
      questions,
      user: session.user.email,
    });
    const saved = await newExam.save();
    if (saved) {
      return NextResponse.json({ success: true, data: saved }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing exam config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
