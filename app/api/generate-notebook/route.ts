// File: app/api/generate-notebook/route.ts
import ISelector from "@/app/interfaces/ISelector";
import { generateNotebook } from "@/app/actions/generateNotebook";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getUserEmail from "@/utils/getUserEmail";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;

    // Validate and parse the 'selected' parameter
    const selectedParam = searchParams.get("selected");
    if (!selectedParam) {
      return NextResponse.json(
        { error: "Missing required parameter: selected" },
        { status: 400 }
      );
    }

    let selected: ISelector[];
    try {
      selected = JSON.parse(selectedParam);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON format for selected parameter" },
        { status: 400 }
      );
    }

    // Validate the structure of each selector
    if (!Array.isArray(selected)) {
      return NextResponse.json(
        { error: "Selected must be an array of selectors" },
        { status: 400 }
      );
    }

    for (const selector of selected) {
      if (typeof selector !== "object" || selector === null) {
        return NextResponse.json(
          { error: "Each selector must be an object" },
          { status: 400 }
        );
      }
      if (typeof selector.name !== "string" || !selector.name.trim()) {
        return NextResponse.json(
          { error: "Each selector must have a non-empty name string" },
          { status: 400 }
        );
      }
      if (!Array.isArray(selector.options)) {
        return NextResponse.json(
          { error: "Each selector must have an options array" },
          { status: 400 }
        );
      }
      for (const option of selector.options) {
        if (typeof option !== "string") {
          return NextResponse.json(
            { error: "All options must be strings" },
            { status: 400 }
          );
        }
      }
    }

    // Validate the 'title' parameter
    const title = searchParams.get("title");
    if (!title) {
      return NextResponse.json(
        { error: "Missing required parameter: title" },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 }
      );
    }

    const token = request.headers.get("authorization")?.split(" ")[1];
    const userEmail = await getUserEmail(token);
    if (!userEmail) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }

    // Call the action
    const result = await generateNotebook(selected, title, userEmail);

    // Handle the action response
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
