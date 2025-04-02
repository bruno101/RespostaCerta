import { toast } from "sonner";

interface ExamConfig {
  dificuldade: number; // 1-3
  numQuestions: number; // 1-5
  timePerQuestion: number; // minutes
  selectedTemas: string[];
  cargo: string;
  examType: string;
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
        description: "Configuração do exame salva com sucesso!",
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
