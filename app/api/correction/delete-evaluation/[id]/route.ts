import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const responseId = params.id;

    // In a real application, you would:
    // 1. Delete the feedback from the database
    // 2. Update the response status back to "pending"

    // Simulate a delay to mimic database operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Avaliação excluída com sucesso",
    });
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    return NextResponse.json(
      { error: "Erro ao excluir avaliação" },
      { status: 500 }
    );
  }
}
