// File: app/api/generate-notebook/route.ts
import ISelector from "@/app/interfaces/ISelector";
import { generateNotebook } from "@/app/actions/generateNotebook";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getUserEmail from "@/utils/getUserEmail";

// Define the expected request body type
interface GenerateNotebookRequest {
  selected: ISelector[];
  title: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: GenerateNotebookRequest = await request.json();

    // Validate 'selected' parameter
    if (!body.selected) {
      return NextResponse.json(
        { error: "Missing required parameter: selected" },
        { status: 400 }
      );
    }

    // Validate structure (same validations as before)
    if (!Array.isArray(body.selected)) {
      return NextResponse.json(
        { error: "Selected must be an array of selectors" },
        { status: 400 }
      );
    }

    // ... (rest of your validation logic for selected items)

    // Validate 'title' parameter
    if (!body.title) {
      return NextResponse.json(
        { error: "Missing required parameter: title" },
        { status: 400 }
      );
    }

    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 }
      );
    }

    // Authentication
    const token = request.headers.get("authorization")?.split(" ")[1];
    const userEmail = await getUserEmail(token);
    if (!userEmail) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }

    // Call the action
    const result = await generateNotebook(body.selected, body.title, userEmail);

    // Handle response
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in generateNotebook route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
