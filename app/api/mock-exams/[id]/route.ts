import ISimulado from "@/app/interfaces/ISimulado";
import Exam from "@/app/models/Exam";
import UserExam from "@/app/models/UserExam";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  await connectToDatabase();
  const id = (await params).id;
  const userExam = await UserExam.findOne({
    exam_id: id,
    user: session?.user?.email,
  }).lean();
  const exam = await Exam.findOne({
    _id: id,
  }).lean();
  if (!exam) {
    return NextResponse.json(
      { error: "Simulado não encontrado." },
      { status: 404 }
    );
  }
  const simulado: ISimulado = {
    ...exam,
    id: exam._id.toString(),
    completed: userExam != undefined,
    questions:
      userExam != undefined
        ? [...exam.questions].map((question, index) => {
            return {
              ...question,
              grade: userExam.grades[index],
              comment: userExam.comments[index],
              userResponse: userExam.responses[index],
            };
          })
        : exam.questions,
  };

  return NextResponse.json(simulado);
}
