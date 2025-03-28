import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/app/models/Question";

/*
generate

db.backup2.deleteMany({});
db.questions.find().forEach(function(doc) {
  db.backup2.insertOne(doc);
});

restore

db.questions.deleteMany({});
db.backup2.find().forEach(function(doc) {
  db.questions.insertOne(doc);
});
*/

// Portuguese title case formatter
function formatInstituicao(text: string): string {
  const lowercaseWords: string[] = ["de", "do", "da", "dos", "das", "e"];

  return (
    text
      .split(" ")
      .map((word: string) => {
        if (!word) return word;

        // Lowercase for connector words
        if (lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }

        // Capitalize first letter, lowercase the rest, handling accents
        return (
          word.charAt(0).toLocaleUpperCase("pt-BR") +
          word.slice(1).toLocaleLowerCase("pt-BR")
        );
      })
      .join(" ")
      // Handle hyphenated words (like Procuradoria-Geral)
      .replace(/-(\w)/g, (_, char) => "-" + char.toLocaleUpperCase("pt-BR"))
  );
}

function formatCargo(text: string): string {
  const lowercaseWords: string[] = ["de", "do", "da", "dos", "das", "e"];

  return (
    text
      .split(" ")
      .map((word: string) => {
        if (!word) return word;

        // Lowercase for connector words
        if (lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }

        // Capitalize first letter, lowercase the rest, handling accents
        return (
          word.charAt(0).toLocaleUpperCase("pt-BR") +
          word.slice(1).toLocaleLowerCase("pt-BR")
        );
      })
      .join(" ")
      // Handle hyphenated words (like Procuradoria-Geral)
      .replace(/-(\w)/g, (_, char) => "-" + char.toLocaleUpperCase("pt-BR"))
  );
}

function removeAfterUnderscoreNumber(text: string): string {
  return text
    .replace(/_\d+.*/, "")
    .replace(/\d{2,}.*/, "") // Remove tudo a partir do primeiro número de dois ou mais dígitos
    .replace(/[\s-]+$/, "") // Remove espaços e hífens no final;
    .replace(/[\d\s]+$/, "");
}

export async function GET() {
  try {
    await connectToDatabase();

    const result = await Question.deleteMany({
      $expr: { $lt: [{ $strLenCP: "$Questao" }, 200] },
    });

    // Get all questions with Instituicao field
    const questions = await Question.find({});

    // Format and update each document
    let updatedCount = 0;
    const sampleUpdates: string[] = [];

    for (const question of questions) {
      const original = question.Instituicao;
      let formatted = formatInstituicao(original);
      formatted = removeAfterUnderscoreNumber(formatted);

      const originalCargos = question.Cargos;
      const formattedCargos = originalCargos.map((c) => formatCargo(c));

      await Question.updateOne(
        { _id: question._id },
        { $set: { Instituicao: formatted, Cargos: formattedCargos } }
      );
      updatedCount++;

      // Store first 5 samples to show in response
      if (sampleUpdates.length < 50) {
        sampleUpdates.push(
          `${original} → ${formatted} ${originalCargos} → ${formattedCargos}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Formatted ${updatedCount} Instituicao fields`,
      sampleUpdates,
      totalProcessed: questions.length,
      updatedCount,
    });
  } catch (error: any) {
    console.error("Error formatting Instituicao:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error formatting Instituicao",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
