import pdf from "pdf-parse";

function fixSrNewlineVariants(text: string): string {
  // Matches "Sr." followed by any newline variant and either "a" or "ta"
  return text.replace(/Sr\.\s*\n\s*(a|ta)\b/g, "Sr.$1");
}

function removeFirstLineTextOccurrences(text: string): string {
  // Split the text into lines
  const lines = text.split("\n");

  // Get the first non-empty line
  let firstLine = "";
  for (const line of lines) {
    if (line.trim() !== "") {
      firstLine = line.trim();
      break;
    }
  }

  // If we found a first line, remove all occurrences of it
  if (firstLine) {
    // Escape special regex characters in the first line text
    const escapedFirstLine = firstLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedFirstLine, "g");
    return text.replace(regex, "");
  }

  return text;
}

function removeFirstBulletPoints(text: string): string {
  // Split the text into lines
  const lines = text.split("\n");

  // Find the start and end of the first bullet point section
  let bulletStart = -1;
  let bulletEnd = -1;
  let lastLineEndedWithPeriod = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (bulletStart !== -1) {
      if (!line.startsWith("•") && lastLineEndedWithPeriod) {
        bulletEnd = i - 1;
        break;
      }

      if (line.endsWith(".")) {
        lastLineEndedWithPeriod = true;
      } else {
        lastLineEndedWithPeriod = false;
      }
    }

    // Detect bullet point start (line starting with •)
    if (line.startsWith("•") && bulletStart === -1) {
      bulletStart = i;
    }

    // Detect end of bullet points (empty line after bullets)
    if (
      bulletStart !== -1 &&
      bulletEnd === -1 &&
      line === "" &&
      i > bulletStart
    ) {
      bulletEnd = i;
      break;
    }
  }

  // If we found bullet points, remove them
  if (bulletStart !== -1) {
    // If we didn't find an end, remove to end of text
    if (bulletEnd === -1) {
      bulletEnd = lines.length;
    }

    // Remove the bullet point lines
    lines.splice(bulletStart, bulletEnd - bulletStart + 1);
  }

  return lines.join("\n");
}

function splitAndRemoveDraftSections(text: string): string[] {
  const lines = text.split("\n");
  const sections: string[] = [];
  let currentSection: string[] = [];
  let inDraftSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";

    // Check if we're entering a draft section
    if (
      !inDraftSection &&
      line.toUpperCase().includes("RASCUNHO") &&
      /^1$/.test(nextLine)
    ) {
      // Save current section if not empty
      if (currentSection.length > 0) {
        sections.push(currentSection.join("\n"));
        currentSection = [];
      }
      inDraftSection = true;
      i++; // Skip the next line (the "1") too
      continue;
    }

    // Check if we're in a draft section
    if (inDraftSection) {
      // Check if we should exit draft section
      if (
        line === "" ||
        /^\d+$/.test(line) ||
        line.toUpperCase().includes("RASCUNHO")
      ) {
        continue; // Still in draft section
      } else {
        inDraftSection = false;
      }
    }

    // Add line to current section if not in draft section
    if (!inDraftSection) {
      currentSection.push(lines[i]);
    }
  }

  // Add the last section if not empty
  if (currentSection.length > 0) {
    sections.push(currentSection.join("\n"));
  }

  return sections;
}

function trimEmptyLines(text: string): string {
  const lines = text.split("\n");

  // Find first non-empty line
  let start = 0;
  while (start < lines.length && lines[start].trim() === "") {
    start++;
  }

  // Find last non-empty line
  let end = lines.length - 1;
  while (end >= 0 && lines[end].trim() === "") {
    end--;
  }

  // If all lines are empty, return empty string
  if (start > end) return "";

  // Slice the array and rejoin
  return lines.slice(start, end + 1).join("\n");
}

function formatText(input: string): string {
  return input
    .split("\n")
    .reduce((acc, line, index, arr) => {
      const trimmedLine = line.trim();
      const isLastLine = index === arr.length - 1;
      const isAllCaps = /^[A-ZÀ-Ú0-9\s]+$/.test(trimmedLine); // Suporte a caracteres acentuados e números em maiúsculas

      if (trimmedLine === "" || isAllCaps) {
        acc.push(trimmedLine, "\n"); // Mantém parágrafos e linhas em caixa alta
      } else {
        const lastIndex = acc.length - 1;
        const lastLine = acc[lastIndex] || "";

        // Verifica se a linha anterior termina com pontuação final
        if (lastLine.match(/[.!?:\];]$/)) {
          acc.push(trimmedLine); // Mantém quebra de linha
        } else if (lastLine === "" || acc[lastIndex] === "\n") {
          acc.push(trimmedLine); // Mantém nova linha
        } else {
          acc[lastIndex] += " " + trimmedLine; // Junta linhas dentro do mesmo parágrafo
        }
      }
      return acc;
    }, [] as string[])
    .join("\n");
}

function removeBrackets(input: string): string {
  return input.replace(/\[.*?\]/g, "");
}
function removeEmptyLines(input: string): string {
  return input
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

function textToParagraphs(text: string): string {
  // Split by newlines and filter out empty lines
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  // Wrap each non-empty line in <p> tags
  const paragraphs = lines.map((line) => `<p>${line.trim()}</p>`);

  // Join all paragraphs into a single HTML string
  return paragraphs.join("\n");
}

export default async function processExamCebraspe(
  pdfUrl: string
): Promise<{ html: string; plainText: string; number: number }[]> {
  try {
    // Fetch the PDF file from the URL
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Get the PDF file as an ArrayBuffer
    const pdfArrayBuffer = await response.arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Parse the PDF
    const data = await pdf(pdfBuffer);

    // Extract text from the PDF
    let text = data.text;
    text = fixSrNewlineVariants(text);
    text = removeFirstLineTextOccurrences(text);
    text = removeFirstBulletPoints(text);
    let questions = splitAndRemoveDraftSections(text);
    return questions.map((question, index) => {
      const text = removeEmptyLines(
        formatText(removeBrackets(trimEmptyLines(question)))
      );
      return {
        html: textToParagraphs(text),
        plainText: text,
        number: index + 1,
      };
    });
  } catch (e) {
    return [];
  }
}
