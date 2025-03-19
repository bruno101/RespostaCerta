// app/api/notebook/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Notebook from "@/app/models/Notebook";
import Question from "@/app/ui/questions/Question";
import { IQuestionSchema } from "@/app/models/Question";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }
    // Connect to the database
    await connectToDatabase();

    // Fetch all questions from the database
    const data = await Notebook.find({
      _id: id,
      user: session.user.email,
    });

    if (!data || !data[0]) {
      return NextResponse.json(
        { error: "Caderno não encontrado" },
        { status: 404 }
      );
    }
    const notebook = data[0];

    const notebooks = {
      ...(notebook as any)._doc,
      numberOfQuestions: notebook.questions.length,
      id: notebook._id.toString(),
    };

    return NextResponse.json(notebooks);
  } catch (error) {
    console.error("Error fetching notebooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch notebooks" },
      { status: 500 }
    );
  }
}

// PUT Route: Update notebook title or currentQuestion
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Get the current session
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    // 2. Validate that the user is logged in
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to update a notebook." },
        { status: 401 }
      );
    }

    // 3. Parse and validate the request body
    const body = await request.json();
    const { title, currentQuestion } = body;

    if (title && typeof title !== "string") {
      return NextResponse.json(
        { error: "Invalid title. Title must be a string." },
        { status: 400 }
      );
    }

    if (currentQuestion && typeof currentQuestion !== "number") {
      return NextResponse.json(
        { error: "Invalid currentQuestion. It must be a number." },
        { status: 400 }
      );
    }

    // 4. Validate the notebook ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid notebook ID." },
        { status: 400 }
      );
    }

    // 5. Connect to the database
    await connectToDatabase();

    // 6. Find the notebook
    const notebook = await Notebook.findById(id);

    if (!notebook) {
      return NextResponse.json(
        { error: "Notebook not found." },
        { status: 404 }
      );
    }

    // 7. Check if the notebook belongs to the logged-in user
    if (notebook.user !== session.user.email) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to update this notebook.",
        },
        { status: 403 }
      );
    }

    // 8. Validate currentQuestion (must be less than questions.length)
    if (
      currentQuestion !== undefined &&
      (currentQuestion < 0 || currentQuestion >= notebook.questions.length)
    ) {
      return NextResponse.json(
        {
          error: `Invalid currentQuestion. It must be between 0 and ${
            notebook.questions.length - 1
          }.`,
        },
        { status: 400 }
      );
    }

    // 9. Update the notebook
    if (title) notebook.title = title;
    if (currentQuestion !== undefined)
      notebook.currentQuestion = currentQuestion;

    await notebook.save();

    // 10. Return the updated notebook
    return NextResponse.json(notebook, { status: 200 });
  } catch (error) {
    console.error("Error updating notebook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE Route: Delete a notebook
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Get the current session
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    // 2. Validate that the user is logged in
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to delete a notebook." },
        { status: 401 }
      );
    }

    // 3. Validate the notebook ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid notebook ID." },
        { status: 400 }
      );
    }

    // 4. Connect to the database
    await connectToDatabase();

    // 5. Find the notebook
    const notebook = await Notebook.findById(id);

    if (!notebook) {
      return NextResponse.json(
        { error: "Notebook not found." },
        { status: 404 }
      );
    }

    // 6. Check if the notebook belongs to the logged-in user
    if (notebook.user !== session.user.email) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to delete this notebook.",
        },
        { status: 403 }
      );
    }

    // 7. Delete the notebook
    await Notebook.findByIdAndDelete(id);

    // 8. Return a success response
    return NextResponse.json(
      { message: "Notebook deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notebook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
