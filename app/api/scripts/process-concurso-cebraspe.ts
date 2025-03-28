import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import processExamCebraspe from "./process-exam-cebraspe";
import IQuestionStage from "@/app/interfaces/IQuestionStage";

function filterStringParts(input: string): string {
  // Split by either "-" or ":"

  const index = input.indexOf(":");
  const filteredInput = index >= 0 ? input.slice(index + 1).trim() : input;

  const parts = filteredInput.split(/[-–]/);

  // Filter and join parts
  const filteredParts = parts.filter((part) => {
    return !/\d/.test(part);
  });

  // Join with - and trim
  return filteredParts.join("-").trim();
}

export default async function processConcursoCebraspe(
  url: string
): Promise<IQuestionStage[]> {
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
  const questions: IQuestionStage[] = [];

  const match = url.match(/(\d{2})(?!\d)/);
  const lastTwoDigits = match ? match[1] : null;
  const year = "20" + lastTwoDigits;

  const h2Text = await page.$eval("h2", (element) => element.textContent);
  const institution = h2Text;

  const cargosListItems = await page.$eval(
    'ul[class*="cargos-list"]', // Selects the first matching <ul>
    (ulElement) => {
      // Extract text from all <li> inside the <ul>
      return Array.from(ulElement.querySelectorAll("li"))
        .map((li) => li.textContent?.trim() || "")
        .map((text) => ({
          text,
          code: (text.match(/\d+(\.\d+)?/g) || [""]).join("-"),
        }));
    }
  );

  const itemsWithDiscursiva = await page.evaluate(() => {
    // Get ALL matching ULs, then pick the last one
    const uls = Array.from(
      document.querySelectorAll('ul[class*="cargos-list"]')
    );
    const lastUl = uls[uls.length - 1]; // Explicitly get the last one

    if (!lastUl) return [];

    return Array.from(lastUl.querySelectorAll("li"))
      .map((li) => {
        const text = li.querySelector("p")?.textContent?.trim() || "";
        const link = li.querySelector("a")?.href || null;
        const codes = [(text.match(/\d+(\.\d+)?/g) || [""]).join("-")];
        return { text, link, codes };
      })
      .filter((item) => {
        const ignore = ["ampliada", "adaptada", "superampliada", "resposta"];
        const shouldIgnore = ignore.some((i) => {
          if (item.text.toLowerCase().includes(i)) {
            return true;
          }
        });
        return !shouldIgnore && item.text.toLowerCase().includes("discursiva");
      });
  });

  const answers = await page.evaluate(() => {
    // Get ALL matching ULs, then pick the last one
    const uls = Array.from(
      document.querySelectorAll('ul[class*="cargos-list"]')
    );
    const lastUl = uls[uls.length - 1]; // Explicitly get the last one

    if (!lastUl) return [];

    function expandNumberRange(input: string): string[] {
      // Regex to match patterns like "1 a 7" (with optional spaces)
      const rangeRegex = /(\d+)\s+a\s+(\d+)/gi;
      const matches = [];
      let result;

      // Find all "x a y" patterns in the input
      while ((result = rangeRegex.exec(input)) !== null) {
        matches.push({
          fullMatch: result[0],
          start: parseInt(result[1], 10),
          end: parseInt(result[2], 10),
          index: result.index,
        });
      }

      // If no matches, return the original string in an array
      if (matches.length === 0) return [input];

      // Generate all possible expanded strings
      const expandedStrings: string[] = [];
      const firstMatch = matches[0]; // For simplicity, handle the first match only (can be extended)

      for (let num = firstMatch.start; num <= firstMatch.end; num++) {
        const newStr =
          input.substring(0, firstMatch.index) +
          num.toString() +
          input.substring(firstMatch.index + firstMatch.fullMatch.length);
        expandedStrings.push(newStr);
      }

      return expandedStrings;
    }

    return Array.from(lastUl.querySelectorAll("li"))
      .map((li) => {
        const text = li.querySelector("p")?.textContent?.trim() || "";
        const link = li.querySelector("a")?.href || null;
        const expandedCodes = expandNumberRange(text);
        const codes = expandedCodes.map((code) =>
          (code.match(/\d+(\.\d+)?/g) || [""]).join("-")
        );

        return { text, link, codes };
      })
      .filter((item) => {
        const ignore = ["ampliada", "adaptada", "superampliada"];
        const shouldIgnore = ignore.some((i) => {
          if (item.text.toLowerCase().includes(i)) {
            return true;
          }
        });
        return (
          !shouldIgnore &&
          item.text.toLowerCase().includes("discursiva") &&
          item.text.toLowerCase().includes("resposta") &&
          item.text.toLowerCase().includes("padrão")
        );
      });
  });

  await browser.close();
  await processExamCebraspe(
    "https://cdn.cebraspe.org.br/concursos/ABIN_17/arquivos/378_ABIN_DISC_003.PDF"
  );

  for (const item of itemsWithDiscursiva) {
    if (!item.link) continue;
    const qArr = await processExamCebraspe(item.link);

    if (cargosListItems.length === 0) {
      continue;
    }
    let cargos: { code: string; text: string }[];
    if (cargosListItems.length === 1) {
      cargos = cargosListItems;
    } else if (itemsWithDiscursiva.length === 1 && item.codes[0] === "") {
      cargos = cargosListItems;
    } else {
      cargos = cargosListItems.filter((cargo) => {
        return cargo.code === item.codes[0];
      });
      if (!cargos || !cargos[0]) {
        continue;
      }
    }

    let answer = "";
    if (answer.length === 1) {
      answer = "Resposta disponível em: " + answers[0].link;
    } else {
      const found = answers.find((a) => {
        return a.codes.includes(item.codes[0]);
      })?.link;
      if (found) {
        answer = "Resposta disponível em: " + found;
      }
    }

    for (const q of qArr) {
      const newQ: IQuestionStage = {
        Criterios: "",
        TextoMotivador: "",
        Link: item.link,
        EmailCriador: "brunobarrosdesousa@alu.ufc.br",
        Banca: "Cebraspe",
        Disciplina: "Unknown",
        Ano: year,
        Questao: q.html,
        Instituicao: institution || "",
        Cargos: cargos.map((cargo) => cargo?.text || ""),
        Resposta: answer,
        TextoPlano: q.plainText,
        Dificuldade: "Média",
        Numero: q.number,
        NotaMaxima: "10",
        Nivel: cargos[0].text.toLowerCase().includes("técnico")
          ? "Médio"
          : "Superior",
      };
      questions.push(newQ);
    }
  }

  /*await processExamCebraspe(
    "https://cdn.cebraspe.org.br/concursos/TRT8_22/arquivos/759_TRT8_019_DISC.PDF"
  );
  const questions: IQuestionStage[] = [];*/

  return questions;
}
