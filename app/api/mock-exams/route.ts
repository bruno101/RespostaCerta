import ISimulado from "@/app/interfaces/ISimulado";
import Exam from "@/app/models/Exam";
import UserExam from "@/app/models/UserExam";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    await connectToDatabase();
    const data = await Exam.find({
      $or: [{ user: session.user.email }, { user: undefined }, { user: null }],
    })
      .sort({ createdAt: -1 })
      .lean();
    const userSimuladodIds = (
      (await UserExam.find({ user: session.user.email })
        .sort({
          createdAt: -1,
        })
        .lean()) || []
    ).map((simulado) => simulado.exam_id.toString());
    const simulados: ISimulado[] = data.map((simulado) => ({
      ...simulado,
      id: simulado._id.toString(),
      completed: userSimuladodIds.includes(simulado._id.toString()),
    }));
    return NextResponse.json(simulados);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 500 });
  }
}
