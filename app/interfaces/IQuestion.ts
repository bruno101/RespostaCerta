export default interface IQuestion {
  Disciplina: string;
  Banca: string;
  Ano: string;
  Nivel: "Fundamental" | "Médio" | "Superior";
  Questao: string;
  Resposta: string;
  Numero?: string;
  Criterios?: string;
  TextoMotivador?: string;
  Codigo: string;
  Instituicao: string;
  Cargos: string[];
  TextoPlano: string;
  Dificuldade: "Fácil" | "Média" | "Difícil";
  NotaMaxima: number;
}
