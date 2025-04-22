import { searchQuestions } from "@/app/actions/searchQuestions";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for request validation with Portuguese messages
const SearchSchema = z.object({
  selected: z
    .array(
      z.object({
        name: z.string({ required_error: "O nome do seletor é obrigatório" }),
        options: z.array(
          z.string({ required_error: "As opções são obrigatórias" }),
          {
            required_error: "As opções são obrigatórias",
          }
        ),
      })
    )
    .default([]), // Default to empty array if not provided
  questionsPerPage: z.coerce
    .number({
      invalid_type_error: "O número de perguntas por página deve ser um número",
    })
    .int("O número de perguntas por página deve ser um inteiro")
    .positive("O número de perguntas por página deve ser positivo")
    .default(5),
  pageNumber: z.coerce
    .number({
      invalid_type_error: "O número da página deve ser um número",
    })
    .int("O número da página deve ser um inteiro")
    .positive("O número da página deve ser positivo")
    .default(1),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters with fallbacks
    const params = {
      selected: searchParams.get("selected")
        ? JSON.parse(searchParams.get("selected")!)
        : [],
      questionsPerPage: searchParams.get("questionsPerPage"),
      pageNumber: searchParams.get("pageNumber"),
    };

    // Validate with defaults - won't throw for invalid numbers, will use defaults instead
    const validated = SearchSchema.parse(params);

    // Call your search function with validated/default values
    const result = await searchQuestions(
      validated.selected,
      validated.questionsPerPage,
      validated.pageNumber
    );

    return NextResponse.json({
      success: true,
      data: result || [],
    });
  } catch (error) {
    console.error("Erro na busca de perguntas:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato JSON inválido no parâmetro selected",
        },
        { status: 400 }
      );
    }

    if (error instanceof z.ZodError) {
      // This should only happen if selected array items are invalid
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos",
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
