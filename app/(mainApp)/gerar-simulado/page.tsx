"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Sparkles,
  ChevronRight,
  Plus,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Roboto } from "next/font/google";
import ISelector from "@/app/interfaces/ISelector";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

type FilterData = {
  Disciplina: string[];
};

export default function GerarSimulado() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ISelector[] | null>(null);
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState<string>("");
  const [pastedText, setPastedText] = useState<string>("");

  // Load filters data
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("/api/filters");
        const data = await response.json();
        setFilters(data);
        setLoading(false);
        toast.success("Dados carregados com sucesso!");
      } catch (error) {
        toast.error("Erro ao carregar filtros");
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleAddSubject = () => {
    if (customSubject.trim()) {
      setSelectedSubjects([...selectedSubjects, customSubject.trim()]);
      setCustomSubject("");
      toast.success("Tema adicionado!");
    }
  };

  const handlePasteSubjects = () => {
    if (pastedText.trim()) {
      const subjects = pastedText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      setSelectedSubjects([...selectedSubjects, ...subjects]);
      setPastedText("");
      toast.success(`${subjects.length} temas adicionados!`);
    }
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = [...selectedSubjects];
    newSubjects.splice(index, 1);
    setSelectedSubjects(newSubjects);
  };

  const handleGenerate = () => {
    toast.success("Simulado sendo gerado...", {
      description: `Com ${selectedSubjects.length} temas selecionados`,
    });
    // Here you would call your API to generate the simulado
  };

  return (
    <>
      {/* Content Container */}
      <div className="bg-[url('/gradient.jpeg')] -mb-[50px] pb-[50px] h-full bg-cover bg-no-repeat bg-center min-h-screen relative z-10">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Animated Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-16 pb-12 px-4 max-w-4xl mx-auto" // Matches card width
        >
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="lg:w-full">
              <motion.h1
                className={
                  "text-3xl md:text-4xl lg:w-full font-[700] text-gray-900" +
                  roboto.className
                }
              >
                Crie Simulados Personalizados para seus Estudos de Concursos
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:w-[50%]"
            >
              <p
                className="text-base lg:pt-[70px] lg:-ml-[100px] md:text-[18px] text-gray-600"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                Gere simulados 100% personalizados que replicam fielmente o
                estilo, formato e nível de dificuldade da banca examinadora
                escolhida
              </p>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-5 mx-auto p-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl mb-20"
        >
          <div className="bg-white rounded-2xl p-8">
            {/* Progress Steps */}
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
              {[1, 2, 3].map((stepNumber) => (
                <button
                  key={stepNumber}
                  onClick={() => stepNumber < step && setStep(stepNumber)}
                  className={`flex flex-col items-center ${
                    stepNumber <= step ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                      stepNumber <= step ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      stepNumber <= step ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {stepNumber === 1 && "Banca"}
                    {stepNumber === 2 && "Disciplina"}
                    {stepNumber === 3 && "Temas"}
                  </span>
                </button>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px]"
              >
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                ) : (
                  <>
                    {step === 1 && (
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-purple-800 mb-6">
                          Selecione a Banca
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              toast.info("Cebraspe selecionada");
                              setStep(2);
                            }}
                            className="bg-gradient-to-br from-purple-100 to-pink-50 border-2 border-purple-200 rounded-xl p-6 flex flex-col items-center hover:border-purple-400 transition-all"
                          >
                            <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                              <ClipboardList className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-purple-800">
                              Cebraspe
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                              (Atualmente a única disponível)
                            </p>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                          Selecione a Disciplina
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {filters
                            ?.find((f) => f.name === "Disciplina")
                            ?.options.map((disciplina) => (
                              <motion.button
                                key={disciplina}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setSelectedDisciplina(disciplina);
                                  setStep(3);
                                  toast.success(`${disciplina} selecionada`);
                                }}
                                className={`p-4 rounded-lg border-2 text-center transition-all ${
                                  selectedDisciplina === disciplina
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-purple-300"
                                }`}
                              >
                                {disciplina}
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                          Adicione os Temas para {selectedDisciplina}
                        </h2>

                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-pink-600 mb-3">
                            Opção 1: Cole do edital
                          </h3>
                          <div className="flex gap-2">
                            <textarea
                              value={pastedText}
                              onChange={(e) => setPastedText(e.target.value)}
                              placeholder="Cole aqui os temas do edital (um por linha)"
                              className="flex-1 border border-gray-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handlePasteSubjects}
                              className="bg-purple-600 text-white px-4 rounded-lg self-start flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Adicionar
                            </motion.button>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-pink-600 mb-3">
                            Opção 2: Adicione manualmente
                          </h3>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customSubject}
                              onChange={(e) => setCustomSubject(e.target.value)}
                              placeholder="Digite um tema"
                              className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddSubject()
                              }
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleAddSubject}
                              className="bg-purple-600 text-white px-4 rounded-lg flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Adicionar
                            </motion.button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-pink-600 mb-3">
                            Temas selecionados
                          </h3>
                          {selectedSubjects.length === 0 ? (
                            <p className="text-gray-500 italic">
                              Nenhum tema adicionado ainda
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {selectedSubjects.map((subject, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex justify-between items-center"
                                >
                                  <span>{subject}</span>
                                  <button
                                    onClick={() => handleRemoveSubject(index)}
                                    className="text-pink-600 hover:text-pink-800"
                                  >
                                    ×
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" /> Voltar
                </motion.button>
              )}

              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step + 1)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 ml-auto"
                >
                  Próximo <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={selectedSubjects.length === 0}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 ml-auto shadow-lg ${
                    selectedSubjects.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl"
                  }`}
                >
                  <Sparkles className="h-5 w-5" /> Gerar Simulado
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
