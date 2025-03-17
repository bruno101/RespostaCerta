import { NextResponse } from "next/server";

interface Question {
  id: number;
  question: string; // HTML string
  correctAnswer: string; // HTML string
  timeLimit: number; // Time limit in seconds for this question
  points: number; // Points this question is worth
}

interface Simulado {
  id: number;
  title: string;
  disciplina: string[]; // Array of disciplines
  cargo: string; // Job role
  concurso: string; // Exam name
  questions: Question[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Mock data for the simulado (AI theme for software developers)
  const simulado: Simulado = {
    id: parseInt((await params).id),
    title: "Simulado de Inteligência Artificial",
    disciplina: ["Inteligência Artificial", "Machine Learning"], // Array of disciplines
    cargo: "Desenvolvedor de Software", // Job role
    concurso: "Ministério Público do Ceará", // Exam name
    questions: [
      {
        id: 1,
        question:
          "<p>Explique o conceito de <strong>aprendizado supervisionado</strong> e dê um exemplo de aplicação em desenvolvimento de software.</p>",
        correctAnswer:
          "<p>O aprendizado supervisionado é um tipo de aprendizado de máquina onde o modelo é treinado usando dados rotulados. Um exemplo de aplicação é a classificação de e-mails como spam ou não spam, onde o modelo é treinado com um conjunto de e-mails previamente classificados.</p>",
        timeLimit: 1200, // 20 minutes
        points: 10,
      },
      {
        id: 2,
        question:
          "<p>Descreva a diferença entre <strong>redes neurais convolucionais (CNNs)</strong> e <strong>redes neurais recorrentes (RNNs)</strong>.</p>",
        correctAnswer:
          "<p>As CNNs são usadas principalmente para processamento de imagens, onde capturam características espaciais através de filtros convolucionais. Já as RNNs são usadas para dados sequenciais, como texto ou séries temporais, pois possuem memória interna para processar informações ao longo do tempo.</p>",
        timeLimit: 900, // 15 minutes
        points: 8,
      },
      {
        id: 3,
        question:
          "<p>O que é <strong>transfer learning</strong> e como ele pode ser útil no desenvolvimento de modelos de IA?</p>",
        correctAnswer:
          "<p>Transfer learning é uma técnica onde um modelo pré-treinado é reutilizado como ponto de partida para uma nova tarefa. Isso é útil porque reduz o tempo e os recursos necessários para treinar um modelo do zero, especialmente quando há poucos dados disponíveis para a nova tarefa.</p>",
        timeLimit: 600, // 10 minutes
        points: 12,
      },
    ],
  };

  return NextResponse.json(simulado);
}
