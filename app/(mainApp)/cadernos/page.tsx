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
  GraduationCap,
} from "lucide-react"; // lucide-react icons
import { FaGraduationCap, FaBook, FaUserTie } from "react-icons/fa"; // react-icons
import { motion } from "framer-motion"; // Framer Motion
import INotebook from "@/app/interfaces/INotebook";

export default function CadernosPage() {
  const [cadernos, setCadernos] = useState<INotebook[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    fetch("/api/notebooks")
      .then((res) => res.json())
      .then((data) => {
        setCadernos(data);
        setIsLoading(false);
      });
  }, []);

  const filteredCadernos = cadernos.filter((caderno) => {
    const searchLower = search.toLowerCase();
    return caderno.title.toLowerCase().includes(searchLower);
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCadernos = filteredCadernos.slice(indexOfFirst, indexOfLast);

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
      <div className="bg-green-100 text-green-900 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-green-600" />
            Cadernos
          </h1>
          <p className="text-lg">
            Organize suas listas de questões nos seus cadernos.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
            <Input
              type="text"
              placeholder="Pesquisar cadernos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Available Cadernos */}
        <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
          <FaGraduationCap className="text-green-400" /> Meus Cadernos
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
            : currentCadernos.map((caderno, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/cadernos/${caderno.id}`}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-purple-800">
                          {caderno.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{caderno.currentQuestion}</span>
                          <span>{caderno.questions.length} questões</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCadernos.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
