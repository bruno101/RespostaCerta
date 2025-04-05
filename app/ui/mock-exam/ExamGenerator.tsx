import {
  Sparkles,
  ChevronRight,
  Plus,
  ClipboardList,
  Clock,
  Layers,
  Gauge,
  Star,
  Check,
  Frown,
  Meh,
  Smile,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { useExamConfig } from "@/app/hooks/useExamConfig";
import { useRouter } from "next/navigation";

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

export default function ExamGenerator() {
  const [questionTypes, setQuestionTypes] = useState<
    QuestionTypeId[] | undefined
  >();
  const [step, setStep] = useState<number>(1);
  const [initialStep, setInitialStep] = useState(true);
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);
  const [currentTemaInput, setCurrentTemaInput] = useState("");
  const [dificuldade, setDificuldade] = useState<1 | 2 | 3>(2); // 1-3
  const [cargo, setCargo] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [numQuestions, setNumQuestions] = useState<1 | 2 | 3 | 4 | 5>(3); // 1-5
  const [timePerQuestion, setTimePerQuestion] = useState<number>(30); // minutes
  const { submitExamConfig } = useExamConfig();
  const router = useRouter();

  const cardRef = useRef<HTMLDivElement>(null); // Create a ref for the card container

  useEffect(() => {
    if (cardRef.current && !initialStep) {
      const cardTop =
        cardRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: cardTop - 70, // Scrolls 100px above the card
        behavior: "smooth",
      });
    }
    setInitialStep(false);
  }, [step]);

  let isContinueDisabled = true;
  switch (step) {
    case 1:
      if (
        questionTypes &&
        questionTypes.length > 0 &&
        questionTypes.length <= 5
      ) {
        isContinueDisabled = false;
      }
      break;
    case 2:
      if (selectedTemas.length > 0 && cargo) {
        isContinueDisabled = false;
      }
      break;
    default:
      isContinueDisabled = false;
  }

  const handleGenerate = async () => {
    console.log("generating");
    try {
      setGenerating(true);
      const result = await submitExamConfig({
        dificuldade,
        numQuestions,
        timePerQuestion,
        selectedTemas,
        cargo,
        questionTypes,
      });
      console.log(result, "\n");

      if (result.success) {
        console.log(`/simulados/${result.data._id}`);
        router.push(`/simulados/${result.data._id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const questionTypesDescription: {
    id: QuestionTypeId;
    title: string;
    description: string;
    frequency: number;
  }[] = [
    {
      id: "DEFINICAO_CONCEITUAL" as const,
      title: "Definição Conceitual",
      frequency: 185,
      description:
        "Defina com precisão termos ou conceitos específicos da área.",
    },
    {
      id: "EXPLANACAO_DETALHADA" as const,
      title: "Explanação Detalhada",
      frequency: 666,
      description:
        "Explique processos, teorias ou sistemas com profundidade técnica.",
    },
    {
      id: "DISSERTACAO_TOPICOS" as const,
      title: "Dissertação Estruturada por Tópicos",
      frequency: 543,
      description:
        "Desenvolva uma redação seguindo exatamente os tópicos solicitados.",
    },
    {
      id: "DISSERTACAO_ABERTA" as const,
      title: "Dissertação Temática Aberta",
      frequency: 72,
      description:
        "Construa um texto argumentativo com liberdade de abordagem sobre o tema.",
    },
    {
      id: "ANALISE_CASO" as const,
      frequency: 328,
      title: "Análise de Caso (Jurídico / Hipotético)",
      description:
        "Analise situações concretas aplicando normas e princípios técnicos.",
    },
    {
      id: "RESOLUCAO_TECNICA" as const,
      frequency: 65,
      title: "Resolução de Problema Técnico / Prático",
      description:
        "Resolva problemas quantitativos ou técnicos com métodos específicos.",
    },
    {
      id: "PARECER_TECNICO" as const,
      frequency: 51,
      title: "Parecer Técnico / Profissional",
      description:
        "Emita um posicionamento fundamentado conforme sua função profissional.",
    },
    {
      id: "PECA_PROCESSO" as const,
      frequency: 57,
      title: "Elaboração de Peça Processual / Documento Formal",
      description:
        "Redija documentos jurídicos com a estrutura e linguagem adequadas.",
    },
    {
      id: "PLANO_ACAO" as const,
      frequency: 54,
      title: "Elaboração de Plano / Programa",
      description:
        "Proponha estratégias estruturadas com metas, ações e prazos definidos.",
    },
    {
      id: "TAREFA_TECNICA" as const,
      frequency: 17,
      title: "Execução de Tarefa Técnica Específica",
      description:
        "Execute cálculos, algoritmos ou demonstrações técnicas precisas.",
    },
    {
      id: "LISTAGEM" as const,
      frequency: 256,
      title: "Listagem / Enumeração Direta",
      description:
        "Enumere elementos, características ou exemplos conforme solicitado.",
    },
    {
      id: "COMPARACAO" as const,
      frequency: 94,
      title: "Comparação / Diferenciação Conceitual",
      description:
        "Contraste conceitos, apontando semelhanças e diferenças essenciais.",
    },
  ].sort((a, b) => {
    return b.frequency - a.frequency;
  });

  function polarToCartesian(
    x: number,
    y: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: x + radius * Math.cos(angleInRadians),
      y: y + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) {
    if (endAngle === 360) endAngle = 359.99;
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const diff = endAngle - startAngle;
    const largeArcFlag = diff <= 180 ? "0" : "1";
    return [
      "M",
      x,
      y,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  }

  function formatTime(minutes: number) {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins ? ` ${mins}m` : ""}`;
    }
    return `${minutes}m`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      ref={cardRef}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-4 sm:mt-[30px] max-w-4xl mx-auto p-[2px] sm:p-[3px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-[17px] shadow-lg sm:shadow-xl mb-8 sm:mb-20"
    >
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8">
        {/* Progress Steps */}
        <div className="mb-6 md:mb-12">
          {/* Mobile Progress Steps - Fixed Spacing */}
          <div className="md:hidden mb-6 w-full">
            {/* Scrollable container with even spacing */}
            <div className="overflow-x-auto pb-3 hide-scrollbar">
              <div
                className="flex"
                style={{
                  width: "max-content",
                  minWidth: "100%",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  gap: "2.5rem", // Fixed equal spacing
                }}
              >
                {[1, 2, 3, 4, 5].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className="flex flex-col items-center"
                    style={{ minWidth: "3rem" }} // Minimum touch target
                  >
                    <button
                      onClick={() => step > stepNumber && setStep(stepNumber)}
                      className="flex flex-col items-center"
                    >
                      {/* Step circle */}
                      <div
                        className={`size-8 rounded-full flex items-center justify-center ${
                          step > stepNumber
                            ? "bg-green-500 text-white"
                            : step === stepNumber
                            ? "bg-gradient-to-br font-bold text-white from-purple-600 to-pink-500 text-white shadow-sm"
                            : "bg-gray-200 text-white font-bold"
                        }`}
                      >
                        {step > stepNumber ? "✓" : stepNumber}
                      </div>

                      {/* Step label */}
                      <span
                        className={`text-xs mt-1 whitespace-nowrap ${
                          step >= stepNumber
                            ? "text-purple-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {
                          [
                            "Estilo",
                            "Tema e Cargo",
                            "Dificuldade",
                            "Questões",
                            "Tempo",
                          ][stepNumber - 1]
                        }
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Desktop (original elegant version) */}
          <div className="hidden md:flex justify-center">
            <div className="flex justify-between w-full max-w-2xl mx-auto relative">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className="flex flex-col items-center relative z-10"
                >
                  <button
                    onClick={() => step > stepNumber && setStep(stepNumber)}
                    className="flex flex-col items-center group mr-2 w-[50px]"
                  >
                    <div
                      className={`size-12 rounded-full flex items-center justify-center text-white font-bold ${
                        step > stepNumber
                          ? "bg-green-500"
                          : step === stepNumber
                          ? "bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg"
                          : "bg-purple-300 group-hover:bg-purple-400"
                      }`}
                    >
                      {step > stepNumber ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          ✓
                        </motion.div>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        step >= stepNumber
                          ? "text-purple-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    >
                      {
                        [
                          "Estilo",
                          "Tema e Cargo",
                          "Dificuldade",
                          "Questões",
                          "Tempo",
                        ][stepNumber - 1]
                      }
                    </span>
                  </button>
                  {stepNumber < 5 && (
                    <div
                      className={`absolute top-6 left-full w-16 h-1 ${
                        step > stepNumber ? "bg-green-500" : "bg-purple-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px] sm:min-h-[400px]"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-purple-100 shadow-sm">
              {step === 1 && (
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-4 sm:mb-8 flex items-center justify-center gap-2">
                    <ClipboardList className="text-pink-500 size-5 sm:size-6" />
                    <span className="text-lg sm:text-2xl">
                      Selecione os Tipos de Questão
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {questionTypesDescription.map((type) => (
                      <motion.button
                        key={type.id}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (
                            questionTypes &&
                            questionTypes.length >= 5 &&
                            !questionTypes.includes(type.id)
                          ) {
                            toast.error("Limite de Tipos de Questão Atingido", {
                              description:
                                "Por favor, selecione no máximo cinco tipos de questão.",
                            });
                          }
                          setQuestionTypes((prev) => {
                            if (!prev) {
                              return [type.id];
                            }
                            if (prev.includes(type.id)) {
                              return prev.filter((t) => t !== type.id);
                            }
                            if (prev.length === 5) {
                              return prev;
                            }
                            return [...prev, type.id];
                          });
                        }}
                        className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 bg-white text-left transition-all duration-200 ${
                          questionTypes && questionTypes.includes(type.id)
                            ? "border-purple-600 ring-2 ring-purple-400 ring-opacity-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                          <ClipboardList size={20} className="sm:size-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                          {type.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 text-center">
                          {type.description}
                        </p>
                        <div className="mt-3 sm:mt-4 flex justify-center">
                          <div
                            className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                              questionTypes?.includes(type.id)
                                ? "bg-purple-600"
                                : "bg-gray-200"
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-6 text-sm text-gray-500 italic">
                    Atualmente disponível apenas no estilo Cebraspe
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-4 sm:mb-6 flex items-center justify-center gap-2">
                    <Layers className="text-pink-500 size-5 sm:size-6" />
                    <span className="text-lg sm:text-2xl">
                      Escolha os Temas e Cargo
                    </span>
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Theme Selection (existing code - unchanged) */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-100">
                      <h3 className="text-base sm:text-lg font-semibold text-pink-600 mb-2 sm:mb-3 flex items-center gap-2">
                        <Plus size={16} className="sm:size-[18px]" />
                        Digite os temas desejados
                      </h3>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Exemplos: Direito Constitucional, Inteligência
                          Artificial, Lei Geral de Proteção de Dados...
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Direito Constitucional",
                            "Inteligência Artificial",
                            "Lei Geral de Proteção de Dados",
                            "Programação em Java",
                          ].map((example) => (
                            <button
                              key={example}
                              onClick={() => {
                                setSelectedTemas([...selectedTemas, example]);
                              }}
                              disabled={selectedTemas.includes(example)}
                              className="disabled:cursor-not-allowed text-xs text-cyan-700 sm:text-sm px-2 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
                            >
                              {example} +
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={currentTemaInput}
                            onChange={(e) =>
                              setCurrentTemaInput(e.target.value)
                            }
                            placeholder="Digite um tema e pressione Enter"
                            className="flex-1 border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                currentTemaInput.trim()
                              ) {
                                if (
                                  !selectedTemas.includes(
                                    currentTemaInput.trim()
                                  )
                                ) {
                                  setSelectedTemas([
                                    ...selectedTemas,
                                    currentTemaInput.trim(),
                                  ]);
                                }
                                setCurrentTemaInput("");
                              }
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (
                                currentTemaInput.trim() &&
                                !selectedTemas.includes(currentTemaInput.trim())
                              ) {
                                setSelectedTemas([
                                  ...selectedTemas,
                                  currentTemaInput.trim(),
                                ]);
                                setCurrentTemaInput("");
                              }
                            }}
                            disabled={
                              !currentTemaInput.trim() ||
                              selectedTemas.includes(currentTemaInput.trim())
                            }
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
                              !currentTemaInput.trim() ||
                              selectedTemas.includes(currentTemaInput.trim())
                                ? "bg-gray-300 text-gray-500"
                                : "bg-purple-600 text-white"
                            }`}
                          >
                            Adicionar
                          </motion.button>
                        </div>

                        {selectedTemas.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Temas adicionados:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedTemas.map((tema) => (
                                <span
                                  key={tema}
                                  className="bg-purple-100 text-purple-800 text-xs sm:text-sm px-2 py-1 rounded-full flex items-center"
                                >
                                  {tema}
                                  <button
                                    onClick={() =>
                                      setSelectedTemas(
                                        selectedTemas.filter((t) => t !== tema)
                                      )
                                    }
                                    className="ml-1 text-purple-500 hover:text-purple-700"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Cargo Selection */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-100">
                      <h3 className="text-base sm:text-lg font-semibold text-pink-600 mb-2 sm:mb-3 flex items-center gap-2">
                        <User className="text-pink-600 size-4 sm:size-5" />
                        Digite o cargo para o qual esse tema será cobrado
                      </h3>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Exemplos: Analista de TI, Técnico Judiciário, Técnico
                          Bancário...
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Analista de Tecnologia da Informação",
                            "Técnico Judiciário - Área Judiciária",
                            "Técnico Bancário",
                          ].map((example) => (
                            <motion.button
                              key={example}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCargo(example)}
                              className={`text-xs sm:text-sm px-2 py-1 rounded-full cursor-pointer ${
                                cargo === example
                                  ? "bg-cyan-600 text-white"
                                  : "bg-gray-100 text-cyan-700 hover:bg-gray-200"
                              }`}
                            >
                              {example}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cargo}
                          onChange={(e) => setCargo(e.target.value)}
                          placeholder="Digite o cargo desejado"
                          className="flex-1 border border-gray-300 rounded-lg p-2 sm:p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="min-h-[400px] flex flex-col px-4">
                  {/* Header */}
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-4 sm:mb-6 flex items-center justify-center gap-2">
                    <Gauge className="text-pink-500 size-5 sm:size-6" />
                    <span className="text-lg sm:text-2xl">
                      Escolha o Nível de Dificuldade
                    </span>
                  </h2>

                  {/* Main Content */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-2xl">
                      <div className="bg-white p-6 sm:p-8 rounded-xl border border-purple-100 shadow-sm">
                        {/* Slider */}
                        <div className="mb-8 px-2 sm:px-4">
                          <Slider
                            value={[dificuldade]}
                            onValueChange={(val) =>
                              setDificuldade(val[0] as 1 | 2 | 3)
                            }
                            min={1}
                            max={3}
                            step={1}
                            className="[&>div>div]:h-2 [&>div>div]:bg-gradient-to-r [&>div>div]:from-green-400 [&>div>div]:via-yellow-400 [&>div>div]:to-red-500"
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-sm font-medium text-gray-600">
                              Fácil
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              Médio
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              Difícil
                            </span>
                          </div>
                        </div>

                        {/* Difficulty Cards - Responsive Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {
                              level: 1,
                              name: "Fácil",
                              icon: (
                                <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                                  <div className="absolute inset-0 bg-green-100 rounded-full blur-md opacity-50"></div>
                                  <div className="relative bg-green-50 border-2 border-green-200 rounded-full w-full h-full flex items-center justify-center">
                                    <Smile className="text-green-600 size-8 sm:size-10" />
                                  </div>
                                </div>
                              ),
                              description: "Perguntas básicas para iniciantes",
                            },
                            {
                              level: 2,
                              name: "Médio",
                              icon: (
                                <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                                  <div className="absolute inset-0 bg-yellow-100 rounded-full blur-md opacity-50"></div>
                                  <div className="relative bg-yellow-50 border-2 border-yellow-200 rounded-full w-full h-full flex items-center justify-center">
                                    <Meh className="text-yellow-600 size-8 sm:size-10" />
                                  </div>
                                </div>
                              ),
                              description:
                                "Desafios moderados para conhecimento intermediário",
                            },
                            {
                              level: 3,
                              name: "Difícil",
                              icon: (
                                <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                                  <div className="absolute inset-0 bg-red-100 rounded-full blur-md opacity-50"></div>
                                  <div className="relative bg-red-50 border-2 border-red-200 rounded-full w-full h-full flex items-center justify-center">
                                    <Frown className="text-red-600 size-8 sm:size-10" />
                                  </div>
                                </div>
                              ),
                              description:
                                "Questões complexas para especialistas",
                            },
                          ].map(({ level, name, icon, description }) => (
                            <motion.div
                              key={level}
                              whileHover={{ y: -3 }}
                              onClick={() => setDificuldade(level as 1 | 2 | 3)}
                              className={`flex flex-col items-center text-center p-4 sm:p-5 rounded-xl cursor-pointer transition-all ${
                                dificuldade === level
                                  ? "bg-purple-50 border border-purple-200 shadow-inner"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="mb-3">{icon}</div>
                              <h3
                                className={`text-lg font-semibold mb-2 ${
                                  dificuldade === level
                                    ? "text-purple-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {name}
                              </h3>
                              <p className="text-sm text-gray-500 px-2">
                                {description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center justify-center px-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-6 sm:mb-10 flex items-center justify-center gap-2">
                    <Star className="text-pink-500 size-5 sm:size-6" />
                    <span className="text-lg sm:text-2xl">
                      Quantidade de Questões
                    </span>
                  </h2>

                  {/* Interactive bubble counter */}
                  <div className="relative mb-10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`absolute rounded-full bg-pink-100 transition-all duration-300 ${
                          numQuestions === 1
                            ? "w-24 h-24 opacity-30"
                            : numQuestions === 2
                            ? "w-28 h-28 opacity-40"
                            : numQuestions === 3
                            ? "w-32 h-32 opacity-50"
                            : numQuestions === 4
                            ? "w-36 h-36 opacity-60"
                            : "w-40 h-40 opacity-70"
                        }`}
                      ></div>
                    </div>
                    <div className="relative bg-white border-2 border-pink-200 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                      <span className="text-4xl font-bold text-pink-600">
                        {numQuestions}
                      </span>
                    </div>
                  </div>

                  {/* Compact slider with number buttons */}
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between mb-2 px-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() =>
                            setNumQuestions(num as 1 | 2 | 3 | 4 | 5)
                          }
                          className={`w-8 h-8 rounded-full transition-all flex items-center justify-center text-sm ${
                            numQuestions === num
                              ? "bg-pink-600 text-white scale-110"
                              : "bg-gray-100 text-purple-600 hover:bg-gray-200"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <Slider
                      value={[numQuestions]}
                      onValueChange={(val) =>
                        setNumQuestions(val[0] as 1 | 2 | 3 | 4 | 5)
                      }
                      min={1}
                      max={5}
                      step={1}
                      className="[&>div>div]:h-2 [&>div>div]:bg-pink-500 mb-6 mt-5"
                    />
                  </div>

                  {/* Animated description pill */}
                  <motion.div
                    key={numQuestions}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 px-4 py-2 bg-purple-50 rounded-full"
                  >
                    <p className="text-sm text-purple-700 text-center">
                      {
                        [
                          "Teste rápido de 1 questão",
                          "Breve avaliação com 2 questões",
                          "Teste moderado de 3 questões",
                          "Desafio com 4 questões",
                          "Avaliação completa com 5 questões",
                        ][numQuestions - 1]
                      }
                    </p>
                  </motion.div>
                </div>
              )}
              {step === 5 && (
                <div className="min-h-[420px] flex flex-col">
                  {/* Keep your original h2 */}
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-6 sm:mb-8 flex items-center justify-center gap-2">
                    <Clock className="text-pink-500 size-5 sm:size-6" />
                    <span className="text-lg sm:text-2xl">
                      Tempo por Questão
                    </span>
                  </h2>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl border border-purple-100 shadow-sm">
                      {/* Time visualization */}
                      <div className="flex justify-center mb-8">
                        <div className="relative w-44 h-44">
                          {/* Clock background with colored sector */}
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            {/* Full circle background */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="#fdf4ff"
                              stroke="#e9d5ff"
                              strokeWidth="2"
                            />

                            {/* Colored sector */}
                            <path
                              d={describeArc(
                                50,
                                50,
                                45,
                                0,
                                (timePerQuestion - 10) * 4.5
                              )}
                              fill="#ec4899"
                              fillOpacity="0.2"
                              stroke="none"
                            />

                            {/* Clock hand */}
                            <line
                              x1="50"
                              y1="50"
                              x2="50"
                              y2="10"
                              stroke="#fa87c0"
                              strokeWidth="4"
                              strokeLinecap="round"
                              transform={`rotate(${
                                (timePerQuestion - 10) * 4.5
                              }, 50, 50)`}
                            />

                            {/* Center dot */}
                            <circle cx="50" cy="50" r="4" fill="#fa87c0" />
                          </svg>

                          {/* Time display */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl sm:text-4xl font-bold text-purple-800">
                              {formatTime(timePerQuestion)}
                            </span>
                            <span className="text-sm sm:text-base text-purple-600 font-medium">
                              por questão
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Slider */}
                      <div className="px-2">
                        <Slider
                          value={[timePerQuestion]}
                          onValueChange={(val) => setTimePerQuestion(val[0])}
                          min={10}
                          max={90}
                          step={5}
                          className="[&>div>div]:h-3 [&>div>div]:bg-gradient-to-r [&>div>div]:from-pink-400 [&>div>div]:to-purple-500 mb-4"
                        />

                        {/* Time markers */}
                        <div className="flex justify-between text-xs sm:text-sm text-gray-500 px-1">
                          {[10, 30, 50, 70, 90].map((time) => (
                            <span key={time}>
                              {time >= 60
                                ? `${Math.floor(time / 60)}h${
                                    time % 60 ? `${time % 60}m` : ""
                                  }`
                                : `${time}m`}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time description */}
                      <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                          {timePerQuestion <= 20 &&
                            "⏱️ Tempo rápido para respostas objetivas"}
                          {timePerQuestion > 20 &&
                            timePerQuestion <= 40 &&
                            "⏳ Tempo moderado para questões padrão"}
                          {timePerQuestion > 40 &&
                            timePerQuestion <= 60 &&
                            "🕒 Tempo amplo para questões complexas"}
                          {timePerQuestion > 60 &&
                            "⏰ Tempo extenso para casos detalhados"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Responsive */}
        <div className="flex justify-between mt-6 sm:mt-8 gap-2 sm:gap-4">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step - 1)}
              className="bg-white border border-purple-300 text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 shadow-sm text-sm sm:text-base"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
              Voltar
            </motion.button>
          )}

          {step < 5 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(step + 1)}
              disabled={isContinueDisabled}
              className="disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 ml-auto shadow-md sm:shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Continuar
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={!selectedTemas || generating}
              className={`disabled:opacity-50 px-4 sm:px-8 py-2 sm:py-3 rounded-lg flex items-center gap-2 ml-auto shadow-md sm:shadow-lg hover:shadow-xl text-sm sm:text-base ${
                !selectedTemas
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              }`}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              {generating ? "Gerando Simulado..." : "Gerar Simulado"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
