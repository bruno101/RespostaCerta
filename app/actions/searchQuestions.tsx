"use server";

import { connectToDatabase } from "@/lib/mongoose";

export async function searchQuestions(
  selected: { options: string[]; name: string }[],
  searchTerm: string
) {
  try {
    await connectToDatabase();
    //TODO
  } catch (error) {
    console.error("Error usearching questions:", error);
    return;
  }
}
