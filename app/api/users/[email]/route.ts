import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/app/models/User";
import Comment from "@/app/models/Comment";
import Response from "@/app/models/Response";
import { UTApi } from "uploadthing/server";
import axios from "axios";
import UserExam from "@/app/models/UserExam";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = "https://api-sandbox.asaas.com/v3";

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

    const user = await User.findOneAndDelete({ email: email });

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
    }
    if (user.subscriptionId) {
      await axios.delete(
        `${ASAAS_API_URL}/subscriptions/${user.subscriptionId}`,
        {
          headers: { access_token: ASAAS_API_KEY },
        }
      );
    }
    if (user.customerId) {
      await axios.delete(`${ASAAS_API_URL}/customers/${user.customerId}`, {
        headers: { access_token: ASAAS_API_KEY },
      });
    }

    await Comment.updateMany(
      { email: email },
      {
        $set: {
          name: "Usuário excluído",
          email: "",
          text: "[comentário removido]",
        },
      }
    );

    await Comment.updateMany(
      { usersWhoLiked: email },
      {
        $pull: {
          usersWhoLiked: email,
        },
      }
    );

    await Response.deleteMany({ user: email });

    await UserExam.deleteMany({ user: email });

    return NextResponse.json({
      success: true,
      message: "Conta excluída com sucesso",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Erro ao excluir conta" },
      { status: 500 }
    );
  }
}
