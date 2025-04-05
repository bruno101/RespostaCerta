import { toast } from "sonner";

type QuestionTypeId =
  | "ANALISE_CASO"
  | "COMPARACAO"
  | "DEFINICAO_CONCEITUAL"
  | "DISSERTACAO_ABERTA"
  | "DISSERTACAO_TOPICOS"
  | "EXPLANACAO_DETALHADA"
  | "LISTAGEM"
  | "PARECER_TECNICO"
  | "PECA_PROCESSO"
  | "PLANO_ACAO"
  | "RESOLUCAO_TECNICA"
  | "TAREFA_TECNICA";

interface ExamConfig {
  dificuldade: 1 | 2 | 3; // 1-3
  numQuestions: 1 | 2 | 3 | 4 | 5; // 1-5
  timePerQuestion: number; // minutes
  selectedTemas: string[];
  cargo: string;
  questionTypes: QuestionTypeId[] | undefined;
}

export const useExamConfig = () => {
  const submitExamConfig = async (config: ExamConfig) => {
    try {
      const response = await fetch("/api/exam-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.error === "Validation failed") {
          const fieldErrors = data.details.fieldErrors;
          let errorMessage = "Por favor, corrija os seguintes erros:";

          Object.entries(fieldErrors).forEach(([field, errors]) => {
            errorMessage += `\n- ${field}: ${(errors as string[]).join(", ")}`;
          });

          toast.error("Erro de Validação", {
            description: errorMessage,
          });
        } else {
          toast.error("Erro", {
            description:
              data.error || "Falha ao salvar a configuração do exame",
          });
        }
        return { success: false, error: data.error };
      }

      toast.success("Sucesso", {
        description: "Simulado gerado com sucesso! Redirecionando...",
      });
      return { success: true, data: data.data };
    } catch (error) {
      console.error("Failed to submit exam config:", error);
      toast.error("Erro de Rede", {
        description:
          "Falha na conexão com o servidor. Por favor, tente novamente.",
      });
      return { success: false, error: "Network error" };
    }
  };

  return { submitExamConfig };
};
