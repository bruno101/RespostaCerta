import { GoogleGenerativeAI } from "@google/generative-ai";
import { getQuestionTypeDefinition } from "./questionTypes";

interface IExamQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  timeLimit: number;
  points: number;
}

export default async function generateExam(
  dificuldade: 1 | 2 | 3,
  numQuestions: 1 | 2 | 3 | 4 | 5,
  timePerQuestion: number,
  selectedTemas: string[],
  cargo: string,
  questionTypes: string[],
  similarQuestions: string[],
  questionsForSimilarCargos: string[],
  questionOfSameType: string[]
): Promise<IExamQuestion[]> {
  try {
    const API_KEY = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Map difficulty to descriptive terms and points
    const difficultyMap = {
      1: { term: "fácil", points: 5 },
      2: { term: "médio", points: 10 },
      3: { term: "difícil", points: 20 },
    };

    // Prepare the prompt for Gemini
    const prompt = `
        Você é um especialista em criação de provas discursivas no estilo Cebraspe. Crie exatamente ${numQuestions} questões de um dos tipos "${questionTypes.join(
      ","
    )}" com estas características:

CARACTERÍSTICAS DA PROVA:
• Dificuldade: ${difficultyMap[dificuldade].term} (${dificuldade}/3)
• Temas obrigatórios: ${selectedTemas.join(", ")}
• Cargo específico: ${cargo}
• Tempo por questão: ${timePerQuestion} minutos

DESCRIÇÃO DOS TIPOS DE QUESTÃO A SEREM ELABORADOS:

${questionTypes.map((e) => getQuestionTypeDefinition(e)).join(", ")}

REQUISITOS ABSOLUTOS:
1. HTML BEM FORMATADO (sem bordas!):
   - Não há necessidade de apresentar o número da questão no topo da questão
   - Você pode usar elementos como cores para enfase, fontes (por exemplo, variando tamanhos), blockquotes, hr, italico para enfase, negrito para enfase
   - Não escreva o texto todo em negrito
   - O html deve ser elegante, preste atenção à apresentação e estética; use a sua criatividade para fazer da apresentação esteticamente agradável

2. ADEQUAÇÃO:
   • Dificuldade proporcional ao nível ${dificuldade}
   • Linguagem técnica e cobrança apropriada para ${cargo}
   • Máxima cobertura dos temas: ${selectedTemas.join(", ")}
   • Cada questão deve seguir um dos tipos de questão a seguir: ${questionTypes.join(
     ","
   )}
   • Caso haja mais de um tipo de questão que possa ser seguido, cubra o máximo deles possível

BASE DE INSPIRAÇÃO (não copiar!):
<< QUESTÕES SOBRE ASSUNTOS SIMILARES >>
${similarQuestions.map((q) => `• ${q.substring(0, 1000)}...`).join("\n")}

<< QUESTÕES PARA CARGOS RELACIONADOS >>
${questionsForSimilarCargos
  .map((q) => `• ${q.substring(0, 1000)}...`)
  .join("\n")}

<< QUESTÕES DOS MESMOS TIPOS DE QUESTÃO >>
${questionOfSameType.map((q) => `• ${q.substring(0, 1000)}...`).join("\n")}

SAÍDA EXIGIDA (APENAS JSON):
[{
  "id": 1,
  "question": "<div style='font-family: Arial; line-height: 1.6;'>[HTML formatado conforme tipo específico]</div>",
  "correctAnswer": "<div style='font-family: Arial; line-height: 1.6;'>[Resposta modelo completa]</div>",
  "timeLimit": ${timePerQuestion * 60},
  "points": ${difficultyMap[dificuldade].points}
}]
      `;

    const generationConfig = {
      temperature: 0.7, // For creativity
      maxOutputTokens: 4096, // To ensure detailed answers
    };

    console.log(
      questionTypes.map((e) => getQuestionTypeDefinition(e)).join(", ")
    );

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();
    const textWithJsonOnly = text
      .replace(/^```json\s*/gm, "") // Start of line
      .replace(/\s*```$/gm, "") // End of line
      .trim();

    // Try to parse the JSON response
    try {
      const questions: IExamQuestion[] = JSON.parse(textWithJsonOnly);

      // Validate the response structure
      if (!Array.isArray(questions) || questions.length !== numQuestions) {
        throw new Error("Invalid number of questions returned");
      }

      console.log("\n***\n", questions, "\n***\n");

      return questions;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", textWithJsonOnly);
      throw new Error("Failed to parse questions from API response");
    }
  } catch (error) {
    console.error("Error generating exam:", error);
    throw new Error("Failed to generate exam questions");
  }
}
