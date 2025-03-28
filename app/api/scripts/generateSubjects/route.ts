import Question from "@/app/models/Question";
import { connectToDatabase } from "@/lib/mongoose";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY || "";

const subjects = [
  "Administração de Recursos Materiais",
  "Administração Geral e Pública",
  "AFO, Direito Financeiro e Contabilidade Pública",
  "Análise das Demonstrações Contábeis",
  "Antropologia",
  "Arqueologia",
  "Arquitetura",
  "Arquivologia",
  "Artes e Música",
  "Atualidades e Conhecimentos Gerais",
  "Auditoria Governamental e Controle",
  "Auditoria Privada",
  "Bancos - Atendimento, Vendas, História, etc.",
  "Biblioteconomia",
  "Biologia e Biomedicina",
  "Ciências Atuariais (Atuária)",
  "Ciências Políticas",
  "Ciências Sociais",
  "Comunicação Social",
  "Contabilidade de Custos",
  "Contabilidade de Instituições Financeiras e Atuariais",
  "Contabilidade Geral",
  "Criminalística e Medicina Legal",
  "Criminologia",
  "Defesa Civil",
  "Desenho Técnico e Artes Gráficas",
  "Direito Administrativo",
  "Direito Agrário",
  "Direito Ambiental",
  "Direito Civil",
  "Direito Constitucional",
  "Direito Cultural, Desportivo e da Comunicação",
  "Direito da Criança e do Adolescente",
  "Direito Digital",
  "Direito do Consumidor",
  "Direito do Trabalho",
  "Direito Econômico",
  "Direito Educacional",
  "Direito Eleitoral",
  "Direito Empresarial (Comercial)",
  "Direito Internacional Público e Privado",
  "Direito Marítimo, Portuário e Aeronáutico",
  "Direito Notarial e Registral",
  "Direito Penal",
  "Direito Penal Militar",
  "Direito Previdenciário",
  "Direito Processual Civil",
  "Direito Processual do Trabalho",
  "Direito Processual Penal",
  "Direito Processual Penal Militar",
  "Direito Sanitário e Saúde",
  "Direitos Humanos",
  "Direito Tributário",
  "Direito Urbanístico",
  "Economia e Finanças Públicas",
  "Educação Física",
  "Enfermagem",
  "Engenharia Aeronáutica",
  "Engenharia Agronômica e Agrícola",
  "Engenharia Ambiental, Florestal e Sanitária",
  "Engenharia Cartográfica",
  "Engenharia Civil e Auditoria de Obras",
  "Engenharia de Produção",
  "Engenharia Elétrica e Eletrônica",
  "Engenharia Mecânica",
  "Engenharia Naval",
  "Estatística",
  "Ética no Serviço Público",
  "Farmácia",
  "Filosofia e Teologia",
  "Finanças e Conhecimentos Bancários",
  "Física",
  "Fisioterapia",
  "Fonoaudiologia",
  "Geografia",
  "Geologia e Engenharia de Minas",
  "Gestão de Projetos (PMBOK)",
  "História",
  "Informática",
  "Legislação Aduaneira",
  "Legislação Civil e Processual Civil Especial",
  "Legislação das Casas Legislativas",
  "Legislação de Trânsito e Transportes",
  "Legislação e Ética Profissional",
  "Legislação Específica das Agências Reguladoras",
  "Legislação Específica das Defensorias Públicas",
  "Legislação Específica das Procuradorias (Advocacias Públicas)",
  "Legislação Específica dos Ministérios Públicos",
  "Legislação Específica dos Tribunais Estaduais",
  "Legislação Específica dos Tribunais Federais",
  "Legislação Geral Estadual e do DF",
  "Legislação Geral Federal",
  "Legislação Militar",
  "Legislação Penal e Processual Penal Especial",
  "Legislação Tributária dos Estados e do Distrito Federal",
  "Legislação Tributária dos Municípios e do Distrito Federal",
  "Legislação Tributária Federal",
  "Libras, Inclusão e Taquigrafia",
  "Língua Alemã (Alemão)",
  "Língua Espanhola (Espanhol)",
  "Língua Francesa (Francês)",
  "Língua Inglesa (Inglês)",
  "Língua Portuguesa (Português)",
  "Literatura Brasileira e Estrangeira",
  "Matemática",
  "Matemática Financeira",
  "Medicina",
  "Meteorologia e Astronomia",
  "Museologia",
  "Nutrição, Gastronomia e Engenharia de Alimentos",
  "Oceanografia",
  "Odontologia",
  "Pedagogia",
  "Psicologia",
  "Química e Engenharia Química",
  "Radiologia",
  "Redação Oficial",
  "Relações Internacionais e Comércio Internacional",
  "Secretariado",
  "Segurança e Proteção Contra Incêndios",
  "Segurança e Saúde no Trabalho (SST)",
  "Segurança Privada e Transportes",
  "Segurança Pública e Legislação Policial",
  "Serviços Gerais",
  "Serviço Social",
  "Teoria Geral, Filosofia e Sociologia Jurídica",
  "Terapia Ocupacional",
  "TI - Banco de Dados",
  "TI - Desenvolvimento de Sistemas",
  "TI - Engenharia de Software",
  "TI - Gestão e Governança de TI",
  "TI - Organização e Arquitetura dos Computadores",
  "TI - Redes de Computadores",
  "TI - Segurança da Informação",
  "TI - Sistemas Operacionais",
  "Turismo",
  "Veterinária e Zootecnia",
];

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
      if (error.status !== 429 && error.status !== 503) {
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
  let prompt = `Eu vou enviar o texto para 3 questões discursivas, separadas por "**QUESTAO**", para que você classifique por assunto.
  Os assuntos possíveis são "[
  "Administração de Recursos Materiais",
  "Administração Geral e Pública",
  "AFO, Direito Financeiro e Contabilidade Pública",
  "Análise das Demonstrações Contábeis",
  "Antropologia",
  "Arqueologia",
  "Arquitetura",
  "Arquivologia",
  "Artes e Música",
  "Atualidades e Conhecimentos Gerais",
  "Auditoria Governamental e Controle",
  "Auditoria Privada",
  "Bancos - Atendimento, Vendas, História, etc.",
  "Biblioteconomia",
  "Biologia e Biomedicina",
  "Ciências Atuariais (Atuária)",
  "Ciências Políticas",
  "Ciências Sociais",
  "Comunicação Social",
  "Contabilidade de Custos",
  "Contabilidade de Instituições Financeiras e Atuariais",
  "Contabilidade Geral",
  "Criminalística e Medicina Legal",
  "Criminologia",
  "Defesa Civil",
  "Desenho Técnico e Artes Gráficas",
  "Direito Administrativo",
  "Direito Agrário",
  "Direito Ambiental",
  "Direito Civil",
  "Direito Constitucional",
  "Direito Cultural, Desportivo e da Comunicação",
  "Direito da Criança e do Adolescente",
  "Direito Digital",
  "Direito do Consumidor",
  "Direito do Trabalho",
  "Direito Econômico",
  "Direito Educacional",
  "Direito Eleitoral",
  "Direito Empresarial (Comercial)",
  "Direito Internacional Público e Privado",
  "Direito Marítimo, Portuário e Aeronáutico",
  "Direito Notarial e Registral",
  "Direito Penal",
  "Direito Penal Militar",
  "Direito Previdenciário",
  "Direito Processual Civil",
  "Direito Processual do Trabalho",
  "Direito Processual Penal",
  "Direito Processual Penal Militar",
  "Direito Sanitário e Saúde",
  "Direitos Humanos",
  "Direito Tributário",
  "Direito Urbanístico",
  "Economia e Finanças Públicas",
  "Educação Física",
  "Enfermagem",
  "Engenharia Aeronáutica",
  "Engenharia Agronômica e Agrícola",
  "Engenharia Ambiental, Florestal e Sanitária",
  "Engenharia Cartográfica",
  "Engenharia Civil e Auditoria de Obras",
  "Engenharia de Produção",
  "Engenharia Elétrica e Eletrônica",
  "Engenharia Mecânica",
  "Engenharia Naval",
  "Estatística",
  "Ética no Serviço Público",
  "Farmácia",
  "Filosofia e Teologia",
  "Finanças e Conhecimentos Bancários",
  "Física",
  "Fisioterapia",
  "Fonoaudiologia",
  "Geografia",
  "Geologia e Engenharia de Minas",
  "Gestão de Projetos (PMBOK)",
  "História",
  "Informática",
  "Legislação Aduaneira",
  "Legislação Civil e Processual Civil Especial",
  "Legislação das Casas Legislativas",
  "Legislação de Trânsito e Transportes",
  "Legislação e Ética Profissional",
  "Legislação Específica das Agências Reguladoras",
  "Legislação Específica das Defensorias Públicas",
  "Legislação Específica das Procuradorias (Advocacias Públicas)",
  "Legislação Específica dos Ministérios Públicos",
  "Legislação Específica dos Tribunais Estaduais",
  "Legislação Específica dos Tribunais Federais",
  "Legislação Geral Estadual e do DF",
  "Legislação Geral Federal",
  "Legislação Militar",
  "Legislação Penal e Processual Penal Especial",
  "Legislação Tributária dos Estados e do Distrito Federal",
  "Legislação Tributária dos Municípios e do Distrito Federal",
  "Legislação Tributária Federal",
  "Libras, Inclusão e Taquigrafia",
  "Língua Alemã (Alemão)",
  "Língua Espanhola (Espanhol)",
  "Língua Francesa (Francês)",
  "Língua Inglesa (Inglês)",
  "Língua Portuguesa (Português)",
  "Literatura Brasileira e Estrangeira",
  "Matemática",
  "Matemática Financeira",
  "Medicina",
  "Meteorologia e Astronomia",
  "Museologia",
  "Nutrição, Gastronomia e Engenharia de Alimentos",
  "Oceanografia",
  "Odontologia",
  "Pedagogia",
  "Psicologia",
  "Química e Engenharia Química",
  "Radiologia",
  "Redação Oficial",
  "Relações Internacionais e Comércio Internacional",
  "Secretariado",
  "Segurança e Proteção Contra Incêndios",
  "Segurança e Saúde no Trabalho (SST)",
  "Segurança Privada e Transportes",
  "Segurança Pública e Legislação Policial",
  "Serviços Gerais",
  "Serviço Social",
  "Teoria Geral, Filosofia e Sociologia Jurídica",
  "Terapia Ocupacional",
  "TI - Banco de Dados",
  "TI - Desenvolvimento de Sistemas",
  "TI - Engenharia de Software",
  "TI - Gestão e Governança de TI",
  "TI - Organização e Arquitetura dos Computadores",
  "TI - Redes de Computadores",
  "TI - Segurança da Informação",
  "TI - Sistemas Operacionais",
  "Turismo",
  "Veterinária e Zootecnia",
];".
  Eu quero que a sua resposta retorne tres assuntos separados por semivírgula (;).
  Exatamente tres assuntos, na ordem correspondente às tres questões que eu enviar. É extremamente importante que as ordens correspondam e que haja um assunto por questão iniciada com "**QUESTAO**". Os assuntos devem corresponder verbatim aos da lista.
  Caso haja algo errado com a questão enviada (por exemplo, ela não é uma questão/conjunto de questões discursivas, se ela contém um conjunto de caracteres incoerentes), retorne "**erro**" em vez do assunto.
  Caso a questão não corresponda a nenhum dos assuntos, retorne "**Unknown**" em vez de um assunto.
  Segue o conteúdo das questões: `;
  text.forEach((q) => {
    prompt += "**QUESTAO**" + q;
  });
  let formatted: string[] = [];
  //const result = await model.generateContent(prompt);
  const result = await generateContentWithRetry(model, prompt);
  const generatedText = result?.response.text() || "**erro2**(500)";
  if (generatedText.includes("**erro2**")) {
    console.log("Erro\n" + index + "\n");
    return [];
  }
  if (generatedText.includes("**erro**")) {
    console.log("Erro\n" + index + "\n");
  }
  if (generatedText.includes("**Unknown**")) {
    console.log("Erro\n" + index + "\n");
  }
  formatted = generatedText.split(";").filter((item) => item.trim() !== "");
  if (formatted.length !== 3) {
    console.log(
      "Numero errado de assuntos\n" + index + "\n" + formatted.length + "\n"
    );
    return [];
  }
  return formatted.map((f) => f.trim());
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  try {
    await connectToDatabase();

    // Get all questions with Instituicao field
    const questions = await Question.find({ Disciplina: "Unknown" });
    console.log(questions.length + " questões achadas\n");
    // Format and update each document
    let updatedCount = 0;
    const sampleUpdates: string[] = [];

    const min = 0;
    const max = questions.length;
    const errors = [];

    for (let i = min; i < max; i = i + 3) {
      console.log("now:", i);
      if (max - i < 3) {
        //tbd
        continue;
      }
      let formattingBatch: string[] = [];
      for (let j = 0; j < 3; j++) {
        formattingBatch.push(questions[i + j].Questao);
      }
      let formattedBatch = await formatQuestao(i, formattingBatch);
      if (formattedBatch.length === 0) {
        errors.push(i);
        console.log(errors);
        continue;
      }
      for (let k = 0; k < 3; k++) {
        const question = questions[i + k];
        const original = formattingBatch[k];
        const formatted = formattedBatch[k];
        if (original !== formatted) {
          if (formatted.includes("*erro*")) {
            await Question.findOneAndDelete({ _id: question._id });
            console.log("deleted \n", question.Questao, "\n");
          } else if (
            !formatted.includes("**Unknown**") &&
            subjects.includes(formatted)
          ) {
            await Question.updateOne(
              { _id: question._id },
              { $set: { Disciplina: formatted } }
            );
          } else {
            console.log("Não classificada *" + formatted + "*");
          }
          updatedCount++;

          // Store first 3 samples to show in response
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
      message: `Classified ${updatedCount} Questions`,
      sampleUpdates,
      totalProcessed: questions.length,
      updatedCount,
    });
  } catch (error: any) {
    console.error("Error classifying:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error classifying",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
