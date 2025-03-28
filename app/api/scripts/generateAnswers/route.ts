import Question from "@/app/models/Question";
import { connectToDatabase } from "@/lib/mongoose";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY || "";

async function generateContentWithRetry(
  model: GenerativeModel,
  prompt: string,
  maxRetries = 5,
  initialDelay = 10000
) {
  let retries = 0;
  let delay = initialDelay;

  while (retries < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      return result; // Success - return the result
    } catch (error: any) {
      if (error.code !== 429 && error.code !== 503) {
        throw error; // Re-throw if it's not a rate limit error
      }

      retries++;
      if (retries >= maxRetries) {
        throw new Error(
          `Max retries (${maxRetries}) exceeded. Last error: ${error}`
        );
      }

      console.warn(
        `Rate limited. Retry ${retries}/${maxRetries} in ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Exponential backoff with some jitter
      delay = Math.min(delay * 2 + Math.random() * 500, 30000); // Cap at 30s
    }
  }
}

async function formatQuestao(index: number, text: string[]): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  /*let prompt = `Eu vou enviar o texto para 1 questão, separadas por "**QUESTAO**".
  Eu quero que a sua resposta retorne respostas detalhadas e completas para cada uma dessas 5 questões em string html. Você pode usar margens, bullet points, enumerações, fontes, cores, formatação de texto etc., mas não adicione bordas.
  Retorne apenas as strings htmls das respostas às questões separadas por "**QUESTAO**".
  Retorne exatamente uma resposta para cada questao iniciada com "**QUESTAO**" que eu enviar, e na ordem correspondente. Assegure que a i-ésima resposta que você me enviar corresponde exatamente à i-ésima questão que eu te enviar, de modo que não haja discrepância e que cada questão enviada tenha a sua respectiva resposta na posição esperada. O total é de 5 respostas separadas por "**QUESTAO**". Caso haja algo de errado com a questão discursiva que eu enviar - por exemplo, se ela não for uma questão discursiva ou houver outra coisa estranha com ela, retorne "**erro**" no lugar da resposta, depois de "**QUESTAO**", para essa questão em específico.
  Segue o conteúdo das questões: `;*/
  let prompt = `Eu vou enviar o texto para 1 questão.
  Eu quero que a sua resposta retorne resposta detalhada e completa para a questão em string html. Você pode usar margens, bullet points, enumerações, fontes, cores, tabelas, formatação de texto etc., mas não adicione bordas.
  Retorne apenas a string html da resposta à questão.
Caso haja algo de errado com a questão discursiva que eu enviar - por exemplo, se ela não for uma questão discursiva ou houver outra coisa estranha com ela, retorne "**erro**" no lugar da resposta para essa questão em específico.
  Segue o conteúdo da questão: `;
  text.forEach((q) => {
    prompt += q;
  });
  let formatted: string[] = [];
  //const result = await model.generateContent(prompt);
  const result = await generateContentWithRetry(model, prompt);
  const generatedText = result?.response.text() || "**erro2**(500)";
  if (generatedText.includes("**erro2**")) {
    console.log("Erro2\n" + index + "\n" + generatedText + "\n");
    return [];
  }
  if (generatedText.includes("**erro**")) {
    console.log("Erro\n" + index + "\n" + generatedText + "\n");
  }
  formatted = generatedText
    .split("**QUESTAO**")
    .filter((item) => item.trim() !== "");
  if (formatted.length !== 1) {
    console.log(
      "Numero errado de questões\n" + index + "\n" + formatted.length + "\n"
    );
    return [];
  }
  return formatted.map((f) =>
    f.replace(/^```html\s*/, "").replace(/\s*```$/, "")
  );
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  try {
    await connectToDatabase();

    // Get all questions with Instituicao field
    const questions = await Question.find({ Resposta: "" });
    console.log(questions.length + " questões achadas\n");
    // Format and update each document
    let updatedCount = 0;
    const sampleUpdates: string[] = [];

    const min = 0;
    const max = questions.length;
    const errors = [];

    for (let i = min; i < max; i = i + 1) {
      console.log("now:", i);
      let formattingBatch: string[] = [];
      for (let j = 0; j < 1; j++) {
        formattingBatch.push(questions[i + j].Questao);
      }
      let formattedBatch = await formatQuestao(i, formattingBatch);
      if (formattedBatch.length === 0) {
        errors.push(i);
        console.log(errors);
        continue;
      }
      for (let k = 0; k < 1; k++) {
        const question = questions[i + k];
        const original = formattingBatch[k];
        const formatted = formattedBatch[k];
        if (original !== formatted) {
          if (formatted.includes("**erro**")) {
            await Question.findOneAndDelete({ _id: question._id });
            console.log("deleted \n", question.Questao, "\n");
          }
          await Question.updateOne(
            { _id: question._id },
            { $set: { Resposta: formatted } }
          );
          updatedCount++;

          // Store first 5 samples to show in response
          if (sampleUpdates.length < 500) {
            sampleUpdates.push(`${original} \n→\n ${formatted}`);
          }
        }
      }
      console.log(errors);
    }
    console.log(errors);

    return NextResponse.json({
      success: true,
      message: `Solved ${updatedCount} Questions`,
      sampleUpdates,
      totalProcessed: questions.length,
      updatedCount,
    });
  } catch (error: any) {
    console.error("Error solving:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error solving",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
