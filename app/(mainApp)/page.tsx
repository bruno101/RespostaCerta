"use client";
import {
  BookOpen,
  CheckCircle,
  FileText,
  Users,
  Clock,
  ArrowRight,
  Award,
  BarChart,
  Clipboard,
  HelpCircle,
} from "lucide-react";
import { FaGraduationCap, FaRegSmile, FaUserFriends } from "react-icons/fa";
import ConcursosTabsSection from "../ui/landing-page/ConcursosTabsSection";
import Banner from "../ui/landing-page/Banner";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <Banner />
      <div className="rounded-md min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <div className="pt-10 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-900 text-center">
            Recursos Principais
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Questões Filtradas */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-cyan-500">
              <FileText className="h-10 w-10 text-cyan-600" />
              <h3 className="mt-4 text-xl font-semibold text-cyan-900">
                Questões Filtradas
              </h3>
              <p className="mt-2 text-cyan-700">
                Acesse questões discursivas de concursos públicos com filtros
                personalizados.
              </p>
            </div>

            {/* Correção por Professores */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-purple-500">
              <Users className="h-10 w-10 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold text-purple-900">
                Correção por Professores
              </h3>
              <p className="mt-2 text-purple-700">
                Envie suas respostas para correção por professores
                especializados.
              </p>
            </div>

            {/* Simulados Personalizados */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-orange-500">
              <Clock className="h-10 w-10 text-orange-600" />
              <h3 className="mt-4 text-xl font-semibold text-orange-900">
                Simulados
              </h3>
              <p className="mt-2 text-orange-700">
                Realize simulados cronometrados para testar seu conhecimento.
              </p>
            </div>

            {/* Geração de Cadernos */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-teal-500">
              <BookOpen className="h-10 w-10 text-teal-600" />
              <h3 className="mt-4 text-xl font-semibold text-teal-900">
                Cadernos de Estudo
              </h3>
              <p className="mt-2 text-teal-700">
                Gere cadernos personalizados para praticar onde e quando quiser.
              </p>
            </div>

            {/* Painel de Progresso */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-cyan-500">
              <FaGraduationCap className="h-10 w-10 text-cyan-600" />
              <h3 className="mt-4 text-xl font-semibold text-cyan-900">
                Painel de Progresso
              </h3>
              <p className="mt-2 text-cyan-700">
                Acompanhe seu desempenho e evolução com métricas detalhadas.
              </p>
            </div>

            {/* Resoluções Explicadas */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-purple-500">
              <CheckCircle className="h-10 w-10 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold text-purple-900">
                Resoluções Explicadas
              </h3>
              <p className="mt-2 text-purple-700">
                Aprenda com resoluções detalhadas de cada questão.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 bg-gradient-to-r from-cyan-600 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white">
              O que nossos usuários dizem
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <FaRegSmile className="h-10 w-10 text-cyan-600 mx-auto" />
                <p className="mt-4 text-cyan-900 italic">
                  "O Resposta Certa mudou a forma como eu estudo. As correções
                  dos professores são incríveis!"
                </p>
                <p className="mt-4 font-semibold text-cyan-600">— Ana Silva</p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <FaUserFriends className="h-10 w-10 text-purple-600 mx-auto" />
                <p className="mt-4 text-purple-900 italic">
                  "Os simulados me ajudaram a me preparar melhor para o
                  concurso. Recomendo!"
                </p>
                <p className="mt-4 font-semibold text-purple-600">
                  — João Souza
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Award className="h-10 w-10 text-orange-600 mx-auto" />
                <p className="mt-4 text-orange-900 italic">
                  "Consegui passar no concurso graças ao Resposta Certa. O
                  painel de progresso foi essencial!"
                </p>
                <p className="mt-4 font-semibold text-orange-600">
                  — Maria Oliveira
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-900 text-center">
            Como Funciona
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-cyan-500">
              <Clipboard className="h-10 w-10 text-cyan-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-cyan-900 text-center">
                Escolha Questões
              </h3>
              <p className="mt-2 text-cyan-700 text-center">
                Selecione questões discursivas com base em filtros
                personalizados.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-purple-500">
              <HelpCircle className="h-10 w-10 text-purple-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-purple-900 text-center">
                Resolva
              </h3>
              <p className="mt-2 text-purple-700 text-center">
                Resolva as questões no seu próprio ritmo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-orange-500">
              <Users className="h-10 w-10 text-orange-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-orange-900 text-center">
                Envie para Correção
              </h3>
              <p className="mt-2 text-orange-700 text-center">
                Envie suas respostas para correção por professores
                especializados.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-teal-500">
              <BarChart className="h-10 w-10 text-teal-600 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-teal-900 text-center">
                Acompanhe seu Progresso
              </h3>
              <p className="mt-2 text-teal-700 text-center">
                Veja métricas detalhadas e melhore seu desempenho.
              </p>
            </div>
          </div>
        </div>

        <ConcursosTabsSection />

        {/* Final Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-cyan-900">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-xl text-cyan-700">
            Junte-se a milhares de usuários que já estão se preparando com o
            Resposta Certa.
          </p>
          <div className="mt-8">
            <a
              href="/questoes"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
