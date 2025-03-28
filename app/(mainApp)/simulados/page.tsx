"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input"; // shadcn Input
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // shadcn Card
import { Skeleton } from "@/components/ui/skeleton"; // shadcn Skeleton
import {
  CheckCircle,
  Clock,
  Search,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Rocket,
} from "lucide-react"; // lucide-react icons
import { FaGraduationCap, FaBook, FaUserTie } from "react-icons/fa"; // react-icons
import { motion } from "framer-motion"; // Framer Motion
import ISimulado from "@/app/interfaces/ISimulado";

export default function SimuladosPage() {
  const [simulados, setSimulados] = useState<ISimulado[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentAvailablePage, setCurrentAvailablePage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    fetch("/api/mock-exams")
      .then((res) => res.json())
      .then((data) => {
        setSimulados(data);
        setIsLoading(false);
      });
  }, []);

  const filteredSimulados = simulados.filter((simulado) => {
    const searchLower = search.toLowerCase();
    return (
      simulado.title.toLowerCase().includes(searchLower) ||
      simulado.cargo.toLowerCase().includes(searchLower) ||
      simulado.concurso.toLowerCase().includes(searchLower) ||
      simulado.disciplina.some((disciplina) =>
        disciplina.toLowerCase().includes(searchLower)
      )
    );
  });

  const availableSimulados = filteredSimulados.filter(
    (simulado) => !simulado.completed
  );
  const completedSimulados = filteredSimulados.filter(
    (simulado) => simulado.completed
  );

  // Pagination logic for available simulados
  const indexOfLastAvailable = currentAvailablePage * itemsPerPage;
  const indexOfFirstAvailable = indexOfLastAvailable - itemsPerPage;
  const currentAvailableSimulados = availableSimulados.slice(
    indexOfFirstAvailable,
    indexOfLastAvailable
  );

  // Pagination logic for completed simulados
  const indexOfLastCompleted = currentCompletedPage * itemsPerPage;
  const indexOfFirstCompleted = indexOfLastCompleted - itemsPerPage;
  const currentCompletedSimulados = completedSimulados.slice(
    indexOfFirstCompleted,
    indexOfLastCompleted
  );

  // Pagination component with ellipsis and "Anterior"/"Próximo" buttons
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    const pages = [];
    const maxPagesToShow = 5; // Maximum number of pagination buttons to show

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-700 hover:text-white focus:bg-cyan-700 focus:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </button>
        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1.5">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1.5 text-sm ${
                currentPage === page
                  ? "bg-cyan-600 text-white hover:bg-cyan-700 focus:bg-cyan-700"
                  : "text-cyan-600 border border-cyan-600 hover:bg-cyan-700 hover:text-white focus:bg-cyan-700 focus:text-white"
              } rounded-lg`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || !totalPages}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-700 hover:text-white focus:bg-cyan-700 focus:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-purple-100 text-purple-900 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-purple-600" />
            Simulados
          </h1>
          <p className="text-lg">
            Prepare-se para o seu concurso com nossos simulados exclusivos.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-0.5 shadow-lg"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Rocket className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Simulado Personalizado
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                  Crie seu próprio simulado escolhendo bancas, disciplinas e
                  temas específicos para focar exatamente no que você precisa
                  estudar.
                </p>

                {/* Custom Button (No Component) */}
                <Link href="/gerar-simulado">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Gerar Simulado Personalizado
                    </span>
                    {/* Animated background shine effect */}
                    <span
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 -rotate-12 origin-left transform scale-x-0 group-hover:scale-x-100"
                      style={{ width: "200%", left: "-50%" }}
                    />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
            <Input
              type="text"
              placeholder="Pesquisar simulados..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Available Simulados */}
        <h2 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
          <FaGraduationCap className="text-purple-400" /> Simulados Disponíveis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : currentAvailableSimulados.map((simulado, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/simulados/${simulado.id}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-purple-800">
                          {simulado.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <FaBook className="text-pink-500" />{" "}
                          {simulado.disciplina.join(", ")}{" "}
                          {/* Display as comma-separated list */}
                        </CardDescription>
                        <CardDescription className="flex items-center gap-2">
                          <FaUserTie className="text-pink-500" />{" "}
                          {simulado.cargo}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{simulado.concurso}</span>
                          <span>{simulado.questions.length} questões</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-pink-500" />{" "}
                          {Math.floor(
                            simulado.questions.reduce(
                              (previous, current) =>
                                previous + current.timeLimit,
                              0
                            ) / 60
                          )}{" "}
                          minutos
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Pagination for Available Simulados */}
        <Pagination
          currentPage={currentAvailablePage}
          totalPages={Math.ceil(availableSimulados.length / itemsPerPage)}
          onPageChange={setCurrentAvailablePage}
        />

        {/* Completed Simulados */}
        <h2 className="mt-8 text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
          <CheckCircle className="text-green-400" /> Simulados Concluídos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="opacity-75">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            : currentCompletedSimulados.map((simulado, index) => (
                <motion.div
                  key={simulado.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/simulados/${simulado.id}`}>
                    <Card className="opacity-75 hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-green-900">
                          {simulado.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 text-gray-800">
                          <FaBook className="text-orange-600" />{" "}
                          {simulado.disciplina.join(", ")}{" "}
                          {/* Display as comma-separated list */}
                        </CardDescription>
                        <CardDescription className="flex items-center gap-2 text-gray-800">
                          <FaUserTie className="text-orange-600" />{" "}
                          {simulado.cargo}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-gray-800">
                          <span>{simulado.concurso}</span>
                          <span>{simulado.questions.length} questões</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-800">
                          <Clock className="h-4 w-4 text-orange-600" />{" "}
                          {simulado.questions.reduce(
                            (previous, current) => previous + current.timeLimit,
                            0
                          ) / 60}{" "}
                          minutos
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Pagination for Completed Simulados */}
        <Pagination
          currentPage={currentCompletedPage}
          totalPages={Math.ceil(completedSimulados.length / itemsPerPage)}
          onPageChange={setCurrentCompletedPage}
        />
      </div>
    </div>
  );
}
