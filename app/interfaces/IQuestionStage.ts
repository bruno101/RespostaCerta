export default interface IQuestionStage {
  Disciplina: string;
  Banca: string;
  Ano: string;
  Nivel: string;
  Instituicao: string;
  Cargos: string[];
  Numero: number;
  TextoMotivador?: string;
  Questao: string;
  Criterios?: string;
  Resposta: string;
  EmailCriador: string;
  TextoPlano: string;
  Dificuldade?: string;
  NotaMaxima?: string;
}
