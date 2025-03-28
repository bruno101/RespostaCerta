import { NextRequest, NextResponse } from "next/server";
import processCebraspe from "./process-cebraspe";
import IQuestion from "@/app/interfaces/IQuestion";
import IQuestionStage from "@/app/interfaces/IQuestionStage";

export async function GET(request: NextRequest) {
  try {
    const questions: IQuestionStage[] = await processCebraspe();

    // Return the extracted text as a JSON response
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
