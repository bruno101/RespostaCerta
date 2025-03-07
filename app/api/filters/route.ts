import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ISelector from "@/app/interfaces/ISelector";
import Filter from "@/app/models/Filter";

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    const filtersArray = await Filter.find();
    const filters = filtersArray[0];
    const selectors: ISelector[] = [
      {
        name: "Disciplina",
        options: filters.Disciplina.sort(),
      },
      {
        name: "Banca",
        options: filters.Banca.sort(),
      },
      {
        name: "Cargo",
        options: filters.Cargo.sort(),
      },
      {
        name: "Instituição",
        options: filters.Instituicao.sort(),
      },
      {
        name: "Ano",
        options: filters.Ano.sort()
          .reverse()
          .map((ano: number) => String(ano)),
      },
      { name: "Nível", options: ["Fundamental", "Médio", "Superior"] },
      { name: "Dificuldade", options: ["Fácil", "Médio", "Difícil"] },
    ];

    return NextResponse.json(selectors);
  } catch (error) {
    console.error("Error fetching selectors:", error);
    return NextResponse.json(
      { error: "Failed to fetch selectors" },
      { status: 500 }
    );
  }
}
