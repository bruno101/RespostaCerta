import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Response from "@/app/models/Response";
import Feedback from "@/app/models/Feedback";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (session.user.role !== "admin" && session.user.role !== "corretor") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    // Check if user has permission to delete evaluations
    const userRole = (session.user as any).role;
    if (userRole !== "admin" && userRole !== "corretor") {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
    }

    const responseId = (await params).id;

    await connectToDatabase();
    const response = await Response.findOne({
      _id: responseId,
    })
      .populate("feedback", "evaluatedBy", Feedback)
      .lean();
    if (!response) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }
    if (
      userRole !== "admin" &&
      (response.feedback as any)?.evaluatedBy !== session.user.email
    ) {
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
    }

    const updatedResponse = await Response.findOneAndUpdate(
      {
        _id: responseId,
      },
      { $set: { status: "pending", feedback: undefined } }
    );

    const deletedFeedback = await Feedback.findOneAndDelete({
      _id: updatedResponse?.feedback,
    });

    if (deletedFeedback) {
      return NextResponse.json({
        success: true,
        message: "Avaliação excluída com sucesso",
      });
    }
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    return NextResponse.json(
      { error: "Erro ao excluir avaliação" },
      { status: 500 }
    );
  }
}
