import Question from "@/app/models/Question";
import { connectToDatabase } from "@/lib/mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY || "";

async function formatQuestao(index: number, text: string[]): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  let prompt = `Eu vou enviar o texto para 1 questão.
  Eu quero que a sua resposta retorne a questão reformatada em string html - elimine rascunhos, títulos genéricos como "QUESTÃO DISCURSIVA" etc., mas sem remover ou resumir comandos nem textos motivadores (não reescreva a questão em si nem seus textos motivadores ou outras informações pertinentes), deixando o enunciado da questão e todo os textos relevantes, e altere a formatação da questão para que a sua apresentação seja mais bonita e elegante, retornando ao fim código html em formato string. Você pode mexer com margens, enumerações, tamanhos de fonte, formatações de texto, mas não adicione bordas nem invente texto adicional que não estava presente.
  Retorne apenas a string html da questão formatada, ou a string "**erro**" se houver algo de estranho com o enunciado da questão (por exemplo, ele não parecer uma questão discursiva, ou consistir apenas em caracteres incoerentes), neste último caso seguido da justificativa do erro.
  Segue o conteúdo da questão: `;
  text.forEach((q) => {
    prompt += q;
  });
  const result = await model.generateContent(prompt);
  const generatedText = result.response.text();
  if (generatedText.includes("**erro**")) {
    console.log("erro", index, generatedText);
    return [];
  }

  return [generatedText];
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const aiUpdate = async () => {};

export async function GET() {
  try {
    await connectToDatabase();

    const questions = await Question.find({});

    // Format and update each document
    let updatedCount = 0;
    const sampleUpdates: string[] = [];

    const errors = [247, 248, 366, 732, 961, 966, 978, 1131, 1133];

    for (let i = 0; i < questions.length; i = i + 1) {
      if (!errors.includes(i)) {
        continue;
      }

      const question = questions[i];

      if (sampleUpdates.length < 500) {
        sampleUpdates.push(`${question}`);
      }
      /*await Question.findOneAndDelete({ _id: question._id });*/
      updatedCount++;

      // Store first 5 samples to show in response

      console.log(errors);
    }
    console.log(errors);

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
  /*await connectToDatabase();

    const questions = await Question.find({});

    // Format and update each document
    let updatedCount = 0;
    const sampleUpdates: string[] = [];

    const min = 977;
    const max = questions.length;
    const oldErrors = [
      245, 250, 255, 260, 365, 375, 380, 385, 435, 475, 480, 490, 620, 655, 675,
      715, 730, 950, 960, 965, 975, 990, 995, 1000, 1130, 1140, 1145, 1175,
      1180, 1185,
    ];
    const errors = [
        247,  248,  366,
        732,  961,  966,
        978, 1131, 1133
      ];

    for (let i = min; i < max; i = i + 1) {
      if (
        !oldErrors.includes(i) &&
        !oldErrors.includes(i - 1) &&
        !oldErrors.includes(i - 2) &&
        !oldErrors.includes(i - 3) &&
        !oldErrors.includes(i - 4)
      ) {
        continue;
      }

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
          await Question.updateOne(
            { _id: question._id },
            { $set: { Questao: formatted } }
          );
          updatedCount++;

          // Store first 5 samples to show in response
          if (sampleUpdates.length < 500) {
            sampleUpdates.push(`${original} → ${formatted}`);
          }
        }
      }
      console.log(errors);
    }
    console.log(errors);

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
  }*/
}
