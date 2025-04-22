import INotebook from "@/app/interfaces/INotebook";
import IQuestion from "@/app/interfaces/IQuestion";
import Notebook, { INotebookSchema } from "@/app/models/Notebook";
import Question, { IQuestionSchema } from "@/app/models/Question";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import getUserEmail from "@/utils/getUserEmail";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const userEmail = await getUserEmail(token);
    if (!userEmail) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }
    // Connect to the database
    await connectToDatabase();

    // Fetch all questions from the database
    const data = await Notebook.find({
      user: userEmail,
    })
      .populate({
        path: "questions",
        options: { limit: 200 },
        model: Question,
      })
      .sort({ createdAt: -1 })
      .exec();

    const fetchNumber = async (id: string) => {
      const q = await Notebook.findById(id).select("questions").lean();
      return q?.questions.length || 0;
    };

    const notebooks = await Promise.all(
      data.map(async (notebook) => ({
        ...(notebook as any)._doc,
        createdAt: (notebook as any).createdAt,
        updatedAt: (notebook as any).updatedAt,
        numberOfQuestions: await fetchNumber(notebook._id.toString()),
        id: notebook._id.toString(),
        subjects: [
          ...new Set(
            (notebook.questions as IQuestionSchema[]).map(
              (question) => question.Disciplina
            )
          ),
        ],
        bancas: [
          ...new Set(
            (notebook.questions as IQuestionSchema[]).map(
              (question) => question.Banca
            )
          ),
        ],
        questions: (notebook.questions as IQuestionSchema[]).map((q) => ({
          Codigo: q._id.toString(), // 👈 Convert ObjectId to string
          Disciplina: q.Disciplina,
          Banca: q.Banca,
          Ano: q.Ano,
          Nivel: q.Nivel,
          Instituicao: q.Instituicao,
          Cargos: q.Cargos,
          TextoMotivador: q.TextoMotivador,
          Questao: q.Questao,
          Criterios: q.Criterios,
          Resposta: q.Resposta,
          TextoPlano: q.TextoPlano,
          Dificuldade: q.Dificuldade,
          NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
        })),
      }))
    );

    return NextResponse.json(notebooks);
  } catch (error) {
    console.error("Error fetching notebooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch notebooks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Get the current session
    const token = request.headers.get("authorization")?.split(" ")[1];

    const userEmail = getUserEmail(token);

    // 2. Validate that the user is logged in
    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to create a notebook." },
        { status: 401 }
      );
    }

    // 3. Parse and validate the request body
    const body = await request.json();
    const { title, questions } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Invalid title. Title must be a string." },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          error:
            "Invalid questions. Questions must be a non-empty array of ObjectId strings.",
        },
        { status: 400 }
      );
    }

    // 4. Validate that all questions are valid ObjectId strings
    const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);
    if (!questions.every(isValidObjectId)) {
      return NextResponse.json(
        {
          error:
            "Invalid questions. All question IDs must be valid ObjectId strings.",
        },
        { status: 400 }
      );
    }

    // 5. Connect to the database
    await connectToDatabase();

    // 6. Create the new notebook
    const newNotebook = {
      title,
      user: userEmail, // Use the logged-in user's email
      questions: questions,
      currentQuestion: 0, // Always set to 0 on creation
    };

    // 7. Save the notebook to the database
    // Assuming you have a Notebook model with a `create` method
    const createdNotebook = await Notebook.create(newNotebook);

    // 8. Return the created notebook
    return NextResponse.json(createdNotebook, { status: 201 });
  } catch (error) {
    console.error("Error creating notebook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
