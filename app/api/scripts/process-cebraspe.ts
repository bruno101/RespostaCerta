import IQuestionStage from "@/app/interfaces/IQuestionStage";
import processConcursoCebraspe from "./process-concurso-cebraspe";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { connectToDatabase } from "@/lib/mongoose";
import Question, { IQuestionSchema } from "@/app/models/Question";

async function pushToDatabase(qArr: IQuestionStage[]): Promise<void> {
  await connectToDatabase();
  const questions = qArr.map((q) => ({
    Disciplina: q.Disciplina,
    Banca: q.Banca,
    Ano: q.Ano,
    Nivel:
      q.Nivel === "Fundamental" || q.Nivel === "Médio" || q.Nivel === "Superior"
        ? q.Nivel
        : "Superior",
    Numero: String(q.Numero),
    Instituicao: q.Instituicao,
    Cargos: q.Cargos,
    TextoMotivador: q.TextoMotivador,
    Questao: q.Questao,
    Criterios: q.Criterios,
    Resposta: q.Resposta,
    TextoPlano: q.TextoPlano,
    Dificuldade:
      q.Dificuldade === "Fácil" ||
      q.Dificuldade === "Média" ||
      q.Dificuldade === "Difícil"
        ? q.Dificuldade
        : "Média",
    NotaMaxima: q.NotaMaxima ? +q.NotaMaxima : 10,
    EmailCriador: q.EmailCriador,
  }));
  const res = await Question.insertMany(questions);
}

export default async function processCebraspe(): Promise<IQuestionStage[]> {
  const minIndex = 0;
  const maxIndex = 10;

  const url = "https://www.cebraspe.org.br/concursos/encerrado";
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath("<Your Chromium URL>")),
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const links = await page.evaluate(() => {
    // Find all UL elements with 'q_circles_holder' class
    const ulElements = Array.from(
      document.querySelectorAll("ul.q_circles_holder")
    );

    // Collect all links from LI items within these ULs
    const allLinks: string[] = [];

    ulElements.forEach((ul) => {
      const liItems = ul.querySelectorAll("li");
      liItems.forEach((li) => {
        const link = li.querySelector("a")?.href;
        if (link) {
          allLinks.push(link);
        }
      });
    });

    return allLinks;
  });

  let questions: IQuestionStage[] = [];

  let skipped: number[] = [
    13, 15, 47, 49, 63, 65, 66, 67, 79, 85, 102, 111, 115, 128, 145, 192, 214,
    222, 237, 267, 269, 270, 271, 272, 278, 298, 300, 301, 304, 306, 307, 308,
    309, 313, 321, 328, 329, 332, 335, 336, 338, 339, 342, 346,
  ];
  let newSkipped: number[] = [];

  for (const i of skipped) {
    console.log(i);
    try {
      const q = await processConcursoCebraspe(links[i]);
      questions = [...questions, ...q];
    } catch (e) {
      console.error(e, " - ", links[i], " - ", i);
      newSkipped.push(i);
    }
  }

  /*for (let i = 261; i < 347; i++) {
    try {
      const q = await processConcursoCebraspe(links[i]);
      questions = [...questions, ...q];
    } catch (e) {
      console.error(e, " - ", links[i], " - ", i);
      skipped.push(i);
    }
  }*/
  await pushToDatabase(questions);
  console.log(
    "\nadded: ",
    questions.length,
    "\nskipped: ",
    newSkipped,
    "\ntotal is: ",
    links.length,
    "\n\n"
  );

  return questions;
}
