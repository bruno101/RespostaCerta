import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Simulate a delay to mimic deletion process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Conta excluída com sucesso (simulação)",
    })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Erro ao excluir conta" }, { status: 500 })
  }
}
