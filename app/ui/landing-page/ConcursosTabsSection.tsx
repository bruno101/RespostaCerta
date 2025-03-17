import { useState } from 'react';
import { TrendingUp, Star, MapPin } from 'lucide-react';

export default function ConcursosTabsSection() {
  const [activeTab, setActiveTab] = useState('em-alta');

  const tabs = [
    {
      id: 'em-alta',
      label: 'Em Alta',
      icon: <TrendingUp className="h-6 w-6" />,
      content: (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Polícia Federal</h3>
            <p className="mt-2 text-sm">
              Concurso previsto para 2024 com mais de 1.000 vagas. Prepare-se agora!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Edital em breve</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-orange-600 to-pink-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Banco do Brasil</h3>
            <p className="mt-2 text-sm">
              Vagas para Escriturário em todo o país. Inscrições abertas!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Inscrições até 30/11</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Prefeitura de São Paulo</h3>
            <p className="mt-2 text-sm">
              Concurso para Professores com mais de 500 vagas. Não perca!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Edital publicado</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'mais-procurados',
      label: 'Mais Procurados',
      icon: <Star className="h-6 w-6" />,
      content: (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">INSS</h3>
            <p className="mt-2 text-sm">
              Concurso previsto para 2025 com mais de 2.000 vagas. Comece a estudar!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">Previsão de edital</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-pink-600 to-red-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Tribunais</h3>
            <p className="mt-2 text-sm">
              Vagas para Analista Judiciário em todo o Brasil. Prepare-se!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">Edital em breve</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Receita Federal</h3>
            <p className="mt-2 text-sm">
              Concurso para Auditor Fiscal com salários atrativos. Fique atento!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">Previsão para 2024</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'na-sua-regiao',
      label: 'Na Sua Região',
      icon: <MapPin className="h-6 w-6" />,
      content: (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-gradient-to-r from-green-600 to-lime-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Prefeitura do Rio de Janeiro</h3>
            <p className="mt-2 text-sm">
              Concurso para Agentes Administrativos. Inscrições abertas!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Vagas para o RJ</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Governo de Minas Gerais</h3>
            <p className="mt-2 text-sm">
              Vagas para Analista de Gestão. Prepare-se para o concurso!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Vagas para MG</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-lg shadow-lg text-white">
            <h3 className="text-xl font-bold">Prefeitura de Curitiba</h3>
            <p className="mt-2 text-sm">
              Concurso para Professores e Técnicos. Não perca a chance!
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Vagas para PR</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-cyan-900 text-center">
        Descubra Concursos
      </h2>
      <div className="mt-8">
        {/* Tabs Navigation */}
        <div className="flex justify-center space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-cyan-900 hover:bg-cyan-50'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="mt-6">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}