import Exam from "@/app/models/Exam";
import Question from "@/app/models/Question";
import { authOptions } from "@/lib/auth";
import {
  generateEmbedding,
  generateEmbeddingForTemas,
} from "@/utils/embedding";
import generateExam from "@/utils/generateExam";
import { getQuestionTypes } from "@/utils/questionTypes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema
const examConfigSchema = z.object({
  dificuldade: z
    .number()
    .min(1, { message: "A dificuldade mínima é 1 (fácil)" })
    .max(3, { message: "A dificuldade máxima é 3 (difícil)" })
    .refine((val) => Number.isInteger(val), {
      message: "A dificuldade deve ser um número inteiro",
    }),

  numQuestions: z
    .number()
    .min(1, { message: "O exame deve ter pelo menos 1 questão" })
    .max(5, { message: "O exame pode ter no máximo 5 questões" })
    .refine((val) => Number.isInteger(val), {
      message: "O número de questões deve ser inteiro",
    }),

  timePerQuestion: z
    .number()
    .min(1, { message: "O tempo mínimo por questão é 1 minuto" })
    .max(90, { message: "O tempo máximo por questão é 90 minutos" })
    .refine((val) => val % 1 === 0 || [0.5, 0.25].includes(val % 1), {
      message:
        "O tempo deve ser em minutos inteiros, meios (0.5) ou quartos (0.25)",
    }),

  selectedTemas: z
    .array(
      z.string().nonempty({
        message: "Os temas não podem conter strings vazias",
      })
    )
    .nonempty({
      message: "Selecione pelo menos um tema",
    })
    .max(5, {
      message: "Selecione no máximo 5 temas",
    }),

  cargo: z
    .string()
    .nonempty({
      message: "O cargo é obrigatório",
    })
    .max(200, {
      message: "O cargo deve ter no máximo 200 caracteres",
    }),

  questionTypes: z
    .array(
      z.enum(getQuestionTypes(), {
        required_error: "O tipo de exame é obrigatório",
        invalid_type_error: "Tipo de exame inválido.",
      })
    )
    .nonempty({
      message: "Selecione pelo menos um tipo de exame",
    })
    .max(5, {
      message: "Selecione no máximo 5 tipos de exame",
    }),
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
    const body: {
      dificuldade: 1 | 2 | 3;
      numQuestions: 1 | 2 | 3 | 4 | 5;
      timePerQuestion: number;
      questionTypes: string[];
      cargo: string;
      selectedTemas: string[];
    } = await request.json();

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

    const cargosEmbedding = await generateEmbedding(body.cargo);

    // Find similar questions using vector search
    const similarQuestions = await Question.aggregate([
      {
        $vectorSearch: {
          index: "embedding_index", // Make sure you've created this index in MongoDB
          path: "Embedding",
          queryVector: temasEmbedding,
          numCandidates: 100,
          limit: 4,
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

    if (similarQuestions.length === 0) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const questionsForSimilarCargos = await Question.aggregate([
      {
        $vectorSearch: {
          index: "cargo_embedding_index", // Make sure you've created this index in MongoDB
          path: "CargoEmbedding",
          queryVector: cargosEmbedding,
          numCandidates: 100,
          limit: 4,
        },
      },
      {
        $project: {
          _id: 1,
          Cargos: 1,
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

    if (questionsForSimilarCargos.length === 0) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const questionsOfSameType = await Promise.all(
      body.questionTypes.map(async (type: string) => {
        const [question] = await Question.aggregate([
          {
            $vectorSearch: {
              index: "cargo_embedding_index",
              path: "CargoEmbedding",
              queryVector: cargosEmbedding,
              numCandidates: 100,
              limit: 1, // Get exactly 1 question per type
            },
          },
          {
            $match: {
              score: { $gt: 0.0 },
              Types: type, // Filter for the current type only
            },
          },
          {
            $project: {
              _id: 1,
              Cargos: 1,
              Questao: 1,
              Types: 1, // Include type in results
            },
          },
        ]);
        return question || null; // Return null if no question found for type
      })
    ).then((results) => results.filter((q) => q !== null)); // Remove null entries

    if (questionsOfSameType.length === 0) {
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
      body.questionTypes,
      similarQuestions.map((q) => q.Questao),
      questionsForSimilarCargos.map((q) => q.Questao),
      questionsOfSameType.map((q) => q.Questao)
    );
    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const count = await Exam.countDocuments({
      title: /^Simulado Personalizado/,
      user: session.user.email,
    });

    const newExam = new Exam({
      title: `Simulado Personalizado #${count + 1}`,
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
