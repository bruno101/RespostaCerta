import User from "@/app/models/User";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const email = (await params).email;

    if (email !== session?.user?.email) {
      return NextResponse.json({ error: "Proibido" }, { status: 403 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        {
          error: "Usuário não encontrado",
        },
        { status: 404 }
      );
    }

    if (user.imageKey) {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(user.imageKey);
      } catch (e) {
        console.error(e);
      }
      user.imageKey = undefined;
    }

    user.image = "";

    user.save();

    return NextResponse.json({
      success: true,
      message: "Imagem excluída com sucesso",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Erro ao excluir imagem" },
      { status: 500 }
    );
  }
}
