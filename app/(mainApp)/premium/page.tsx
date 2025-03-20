"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { FaRegSmile, FaUserFriends, FaAward } from "react-icons/fa";
import Footer from "../footer";
import Link from "next/link";

const PremiumPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-purple-600 py-20 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4"
        >
          Desbloqueie Todo o Potencial do Resposta Certa
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mb-8"
        >
          Acesso ilimitado a simulados, correções de professores e muito mais
          por apenas R$5/mês.
        </motion.p>
        <Link href="/subscribe">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-cyan-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto"
          >
            Assine Agora <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </Link>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-cyan-900 text-center mb-8">
          Comparação de Planos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-cyan-500">
            <h3 className="text-xl font-semibold text-cyan-900 mb-4">Grátis</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-cyan-700">Simulados: 5 por mês</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-cyan-700">
                  Respostas de Questões: 1 por dia
                </span>
              </li>
              <li className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-cyan-700">
                  Salvar Filtros em Cadernos
                </span>
              </li>
              <li className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-cyan-700">Correção por Professores</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Premium
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-purple-700">Simulados: Ilimitados</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-purple-700">
                  Respostas de Questões: Ilimitadas
                </span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-purple-700">
                  Salvar Filtros em Cadernos
                </span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-purple-700">
                  Correção por Professores
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            O que nossos usuários dizem
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <FaRegSmile className="h-10 w-10 text-cyan-600 mx-auto" />
              <p className="mt-4 text-cyan-900 italic">
                "O Premium mudou a forma como eu estudo. As correções dos
                professores são incríveis!"
              </p>
              <p className="mt-4 font-semibold text-cyan-600">— Ana Silva</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <FaUserFriends className="h-10 w-10 text-purple-600 mx-auto" />
              <p className="mt-4 text-purple-900 italic">
                "Os simulados ilimitados me ajudaram a me preparar melhor para o
                concurso. Recomendo!"
              </p>
              <p className="mt-4 font-semibold text-purple-600">— João Souza</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <FaAward className="h-10 w-10 text-orange-600 mx-auto" />
              <p className="mt-4 text-orange-900 italic">
                "Consegui passar no concurso graças ao Resposta Certa Premium. O
                painel de progresso foi essencial!"
              </p>
              <p className="mt-4 font-semibold text-orange-600">
                — Maria Oliveira
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-cyan-900 mb-4">
          Assine o Premium por Apenas R$5/mês
        </h2>
        <p className="text-xl text-cyan-700 mb-8">
          Comece sua jornada de estudos com recursos ilimitados.
        </p>
        <Link href="/subscribe">
          <button className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105">
            Assine Agora
          </button>
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-cyan-900 text-center mb-8">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-900">
              Posso cancelar a qualquer momento?
            </h3>
            <p className="mt-2 text-cyan-700">
              Sim, você pode cancelar sua assinatura a qualquer momento.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-900">
              Há um período de teste gratuito?
            </h3>
            <p className="mt-2 text-cyan-700">
              Sim, oferecemos um teste gratuito de 7 dias.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-900">
              Como faço para atualizar para o Premium?
            </h3>
            <p className="mt-2 text-cyan-700">
              Basta clicar no botão 'Assine Agora' e seguir as instruções.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
