import Exam from "@/app/models/Exam";
import UserExam from "@/app/models/UserExam";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    await connectToDatabase();
    const exam = await Exam.findOne({ _id: id });
    if (!exam) {
      return NextResponse.json(
        { error: "Simulado não encontrado" },
        { status: 404 }
      );
    }
    const userExam = await UserExam.findOne({
      user: session.user.email,
      exam_id: id,
    });
    if (userExam) {
      return NextResponse.json(
        { error: "Simulado já concluído" },
        { status: 400 }
      );
    }
    const newUserExam = new UserExam({
      user: session.user.email,
      exam_id: id,
      grades: exam?.questions?.map((question) => 0),
      comments: exam?.questions?.map((question) => ""),
      responses: exam?.questions?.map((question) => ""),
    });
    const res = await newUserExam.save();
    if (res) {
      return NextResponse.json(
        { message: "Marcado como feito" },
        { status: 201 }
      );
    }
    return NextResponse.json({ status: 500 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 500 });
  }
}
