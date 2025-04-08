const descriptions: {
  questionTypes: {
    type: string;
    name: string;
    description: string;
    examples: string[];
    characteristics: string[];
    criteria: string[];
  }[];
} = {
  questionTypes: [
    {
      type: "DEFINICAO_CONCEITUAL",
      name: "Definição Conceitual",
      description:
        "Solicita a apresentação clara e objetiva do significado de um termo, conceito, instituto ou sigla específica de uma área do conhecimento. Foco na precisão terminológica.",
      examples: [
        "Defina avaliação.",
        "Conceitue educação não escolar.",
        "...definindo gerenciamento de processos de negócio...",
      ],
      characteristics: [
        "Verbos como 'definir', 'conceituar', 'o que é'",
        "Pede o significado de um termo específico",
        "Resposta geralmente curta e direta",
        "Foco na exatidão da definição",
      ],
      criteria: [
        "Comando explícito para definir ou conceituar",
        "O objeto da pergunta é um termo ou conceito isolado",
        "Não exige explanação aprofundada, comparação ou aplicação",
      ],
    },
    {
      type: "EXPLANACAO_DETALHADA",
      name: "Explanação Detalhada",
      description:
        "Requer a descrição aprofundada de um tema, conceito, processo, funcionamento, características ou princípios, indo além da simples definição e exigindo detalhamento.",
      examples: [
        "Explique o que é análise estática de código-fonte (SAST).",
        "Descreva de modo sucinto o protocolo SNMP. Em seu texto, esclareça o que é esse protocolo e qual a sua finalidade...",
        "Conceitue margem de contribuição unitária e identifique a forma de apuração do seu valor.",
      ],
      characteristics: [
        "Verbos como 'explicar', 'descrever', 'discorrer sobre o funcionamento/princípio/características', 'apresentar'",
        "Pede mais do que a definição; exige detalhes sobre como algo funciona, suas partes, seu propósito, suas características",
        "Pode envolver sequências, etapas, componentes",
        "Requer conhecimento mais aprofundado que a simples definição",
      ],
      criteria: [
        "Comando para explicar, descrever em detalhe, discorrer sobre aspectos específicos (funcionamento, características, etc.)",
        "Não se limita a dar o significado de um termo",
        "Não está (primariamente) inserida em um caso hipotético complexo nem pede um documento formal",
      ],
    },
    {
      type: "DISSERTACAO_TOPICOS",
      name: "Dissertação Estruturada por Tópicos",
      description:
        "Solicita a elaboração de um texto dissertativo sobre um tema central, cuja abordagem deve obrigatoriamente seguir uma estrutura pré-definida por tópicos (numerados ou em bullets) apresentados no comando da questão.",
      examples: [
        "redija um texto dissertativo a respeito do papel dos governos [...] Em seu texto, aborde os seguintes tópicos. 1. A fronteira como espaço... 2. Distintas relações... 3. Papel da área de inteligência...",
        "redija um texto dissertativo a respeito do papel da programação orientada a objetos [...] Ao elaborar seu texto, aborde: 1. os conceitos básicos... 2. as vantagens... 3. a diferença entre...",
        "redija um texto dissertativo a respeito do seguinte tema. A INTELIGÊNCIA DE AMEAÇAS [...] Ao elaborar seu texto, aborde os seguintes aspectos: 1. características... 2. desafios... 3. mitos e realidade...",
      ],
      characteristics: [
        "Comando 'redija um texto dissertativo' ou similar",
        "Apresenta um tema geral",
        "Lista explicitamente os aspectos/tópicos/pontos que devem ser abordados",
        "A resposta esperada é um texto coeso, mas claramente segmentado pelos tópicos solicitados",
        "Pode incluir sub-tarefas de outros tipos (definição, explanação, listagem, comparação) dentro dos tópicos",
      ],
      criteria: [
        "Pede um texto dissertativo",
        "Fornece uma lista explícita (numerada, bullets, etc.) de subtópicos obrigatórios a serem cobertos",
        "Não é primariamente a análise de um caso ou a elaboração de um documento formal",
      ],
    },
    {
      type: "DISSERTACAO_ABERTA",
      name: "Dissertação Temática Aberta",
      description:
        "Requer a elaboração de um texto dissertativo sobre um tema geral, oferecendo ao candidato maior liberdade na estruturação dos argumentos e na seleção dos aspectos a serem aprofundados. Pode haver sugestões gerais, mas sem uma lista rígida de tópicos obrigatórios.",
      examples: [
        "...redija um texto, definindo gerenciamento de processos de negócio explicando para que ele serve e o que ele engloba.",
        "...redija um texto dissertativo acerca da guerra e seus efeitos sobre a população civil.",
        "...redija um texto dissertativo acerca do seguinte tema: A UNIVERSALIDADE DOS DIREITOS HUMANOS E O SISTEMA PENITENCIÁRIO...",
      ],
      characteristics: [
        "Comando 'redija um texto dissertativo' ou similar",
        "Apresenta um tema amplo",
        "Não fornece uma lista explícita e rígida de subtópicos obrigatórios (ou os tópicos sugeridos são muito amplos)",
        "Exige maior capacidade de planejamento e argumentação autônoma do candidato",
        "A resposta esperada é um texto coeso e bem argumentado sobre o tema proposto",
      ],
      criteria: [
        "Pede um texto dissertativo",
        "O tema é amplo e não há uma lista detalhada e obrigatória de subtópicos a seguir",
        "Diferencia-se do Tipo 3 pela ausência de estrutura imposta por tópicos específicos",
      ],
    },
    {
      type: "ANALISE_CASO",
      name: "Análise de Caso (Jurídico / Hipotético)",
      description:
        "Apresenta uma situação fática detalhada, geralmente envolvendo aspectos legais, normativos ou éticos, e solicita uma análise dessa situação, aplicação de regras, identificação de irregularidades, direitos, deveres ou a resposta a questionamentos específicos sobre o caso.",
      examples: [
        "Discorra sobre a situação hipotética apresentada abordando: 1. os fatores que justificam a contratação por dispensa... 2. as exigências do processo licitatório... 3. as situações excepcionais...",
        "Considerando as informações apresentadas, redija um texto dissertativo respondendo, de forma fundamentada, aos seguintes questionamentos. 1. Os atos de improbidade... 2. Carlos pode ser réu... 3. É necessária a comprovação... 4. Deve ser deferido...",
        "Considerando a situação hipotética apresentada anteriormente, responda, de forma fundamentada, aos seguintes questionamentos. 1. A insegurança... constitui risco...? 2. Há responsabilidade objetiva ou subjetiva...? 3. Tal responsabilidade é fundada...? 4. A situação enseja...?",
      ],
      characteristics: [
        "Apresenta um cenário, caso, situação hipotética detalhada",
        "Frequentemente envolve nomes, datas, ações específicas",
        "Pede análise, aplicação de leis/normas, julgamento sobre a legalidade/correção de atos dentro do cenário",
        "Muitas vezes, os questionamentos são diretos e específicos sobre o caso",
        "Requer aplicação do conhecimento teórico a um contexto prático",
      ],
      criteria: [
        "Baseia-se em uma narrativa situacional (caso hipotético)",
        "Solicita análise, aplicação de normas ou resposta a perguntas sobre essa situação específica",
        "Não se confunde com Resolução de Problema Técnico (foco não é cálculo/solução técnica) nem com Parecer (não exige necessariamente a formalidade ou o papel profissional explícito)",
      ],
    },
    {
      type: "RESOLUCAO_TECNICA",
      name: "Resolução de Problema Técnico / Prático",
      description:
        "Apresenta um cenário, dados, diagramas ou especificações técnicas e requer a aplicação de conhecimentos científicos, de engenharia, TI, matemática, estatística, etc., para resolver um problema, analisar um sistema, interpretar dados, propor uma solução técnica ou realizar cálculos específicos.",
      examples: [
        "Apresenta diagramas de circuito e pede descrição de características TTL, subfamílias, identificação de circuito, cálculo de tensão, descrição de instrumentos.",
        "Apresenta tabela de dados e pede para escolher método de machine learning, descrevê-lo e enumerar passos para estimar um valor.",
        "Apresenta especificações de um banco de baterias e pede para determinar o número de elementos necessários em diferentes regimes.",
      ],
      characteristics: [
        "Baseia-se em informações técnicas, dados numéricos, diagramas, especificações",
        "Requer aplicação de fórmulas, métodos, princípios técnicos ou científicos",
        "Pode envolver cálculos, análises quantitativas, interpretação de gráficos/diagramas",
        "A resposta geralmente envolve etapas lógicas, justificativas técnicas ou resultados numéricos",
      ],
      criteria: [
        "O problema é de natureza técnica, científica ou quantitativa",
        "Exige a aplicação de conhecimentos específicos da área (engenharia, TI, estatística, etc.) para análise ou solução",
        "Pode incluir cálculos, mas o foco é a aplicação do conhecimento técnico ao problema apresentado",
        "Diferencia-se da Análise de Caso por não focar primariamente em aspectos jurídicos/normativos",
      ],
    },
    {
      type: "PARECER_TECNICO",
      name: "Parecer Técnico / Profissional",
      description:
        "Solicita um posicionamento formal e fundamentado sobre uma questão ou situação específica, exigindo que o candidato assuma um papel profissional (juiz, contador, engenheiro, advogado, auditor, consultor) e utilize conhecimentos técnicos da área para embasar sua opinião ou recomendação.",
      examples: [
        "...redija um parecer técnico acerca do sistema de disposição de rejeitos filtrados, a fim de auxiliar a empresa Alfa [...] Em seu texto, aborde necessariamente os seguintes aspectos:...",
        "...redija um parecer técnico para auxiliar a empresa A na definição dos instrumentos geotécnicos [...] Em seu texto, faça o que se pede a seguir...",
        "Considerando a situação hipotética apresentada, elabore parecer acerca dos aspectos jurídico-positivos pertinentes ao requerimento.",
      ],
      characteristics: [
        "Verbos como 'emitir parecer', 'posicionar-se como', 'analisar como [profissional]'",
        "Contexto profissional específico mencionado ou implícito",
        "Requer análise técnica e fundamentação baseada em normas, leis, boas práticas da área",
        "A resposta deve ter um tom formal e profissional, culminando em uma conclusão ou recomendação",
        "Frequentemente baseado em uma situação hipotética, mas o foco é o posicionamento profissional",
      ],
      criteria: [
        "Pede explicitamente um parecer, opinião profissional ou análise sob a ótica de um cargo/função",
        "Exige fundamentação técnica/normativa da área",
        "O resultado esperado é um texto formal com análise e conclusão/recomendação",
      ],
    },
    {
      type: "PECA_PROCESSO",
      name: "Elaboração de Peça Processual / Documento Formal",
      description:
        "Requer a redação de um documento formal específico, geralmente do âmbito jurídico ou administrativo, como uma petição inicial, contestação, recurso, parecer jurídico formal (diferente do parecer técnico pela estrutura e contexto legal), relatório de auditoria, etc., seguindo a estrutura e linguagem adequadas.",
      examples: [
        "...elabore, na condição de advogado da União responsável pelo caso, a peça cabível para a defesa da União e do presidente da República...",
        "...elabore, na condição de procurador(a) da Fazenda Nacional, a peça processual adequada para a defesa da União.",
        "...elabore o recurso cabível para impugnar o acórdão...",
      ],
      characteristics: [
        "Pede explicitamente a elaboração de uma 'peça processual', 'peça jurídica', 'recurso', 'contestação', 'petição', 'relatório de auditoria', 'parecer jurídico' (com estrutura formal definida)",
        "Exige conhecimento da estrutura, formalidades e linguagem típicas do documento solicitado",
        "Geralmente baseado em uma situação hipotética detalhada (um caso processual, uma auditoria, etc.)",
        "Requer aplicação de conhecimento jurídico/normativo para construir os argumentos da peça",
      ],
      criteria: [
        "Comando direto para redigir um tipo específico de documento formal (peça processual, relatório, etc.)",
        "A avaliação considera não só o conteúdo, mas também a adequação da forma e linguagem ao tipo de documento",
        "Diferencia-se do Parecer Técnico pela natureza do documento (geralmente jurídico/processual) e/ou pela estrutura mais rígida exigida",
      ],
    },
    {
      type: "PLANO_ACAO",
      name: "Elaboração de Plano / Programa",
      description:
        "Solicita a proposição de um plano de ação, programa, projeto ou conjunto de medidas estruturadas para atingir um objetivo, resolver um problema ou implementar uma iniciativa, detalhando fases, ações, responsabilidades ou características.",
      examples: [
        "...redija um texto, em forma de um plano de gestão de riscos, acerca de riscos profissionais...",
        "Proponha um programa de educação corporativa para uma situação hipotética de aprendizagem organizacional. Seu texto deve explicitar a necessidade..., conter as fases..., e contemplar as ações...",
      ],
      characteristics: [
        "Verbos como 'propor', 'elaborar um plano/programa', 'apresentar medidas'",
        "Requer estruturação de ações em fases, etapas, componentes",
        "Foco na solução prática e organizada para um problema ou objetivo",
        "Pode exigir detalhamento de objetivos, metas, ações, recursos, cronograma, etc.",
      ],
      criteria: [
        "Pede explicitamente a criação de um plano, programa ou conjunto estruturado de medidas",
        "A resposta deve ter uma estrutura lógica de planejamento (fases, ações, etc.)",
        "Não é apenas uma análise de caso ou uma dissertação teórica",
      ],
    },
    {
      type: "TAREFA_TECNICA",
      name: "Execução de Tarefa Técnica Específica",
      description:
        "Exige a realização de uma tarefa técnica bem definida, como o desenvolvimento de um algoritmo, a execução de um cálculo complexo (matemático, estatístico, atuarial, financeiro) ou a demonstração prática de um processo ou teorema.",
      examples: [
        "...desenvolva um algoritmo para decifrar a frase [...] Defina o algoritmo e a estrutura de dados [...]. Utilize estruturas de controle [...]. Decifre a frase.",
        "...redija um texto acerca de tecnologia da informação [...] 1. Defina entropia... 2. Determine a entropia diferencial... 3. Demonstre que a distribuição exponencial...",
        "Pede explicações sobre cálculo de reservas atuariais (discreto vs. contínuo) e comparação/aplicação. Envolve conceitos e possivelmente fórmulas.",
      ],
      characteristics: [
        "Verbos como 'desenvolver algoritmo', 'calcular', 'determinar', 'demonstrar', 'resolver'",
        "Requer aplicação direta de habilidades técnicas (programação, matemática, estatística, etc.)",
        "O resultado esperado é um algoritmo, um cálculo, uma demonstração formal, ou a própria solução de um problema numérico/lógico",
        "Pode exigir justificativa da metodologia usada",
        "Menos 'discursiva' no sentido tradicional de ensaio",
      ],
      criteria: [
        "O comando principal é para executar uma tarefa técnica específica (codificar, calcular, demonstrar)",
        "A resposta central é o resultado dessa tarefa (código, número, prova matemática)",
        "Exige conhecimento prático e aplicado da ferramenta/técnica solicitada",
      ],
    },
    {
      type: "LISTAGEM",
      name: "Listagem / Enumeração Direta",
      description:
        "Solicita predominantemente que o candidato liste ou enumere elementos (exemplos, características, tipos, fases, princípios, etc.) relacionados a um tema, sem a necessidade de aprofundamento ou desenvolvimento discursivo extenso para cada item.",
      examples: [
        "Cite oito políticas...",
        "Cite cinco diretrizes...",
        "Cite as quatro principais perspectivas clássicas utilizadas no BSC.",
      ],
      characteristics: [
        "Verbos como 'citar', 'listar', 'enumerar', 'indicar', 'apontar [N itens]'",
        "Pede uma quantidade específica ou a totalidade de elementos de uma categoria",
        "A resposta é primariamente uma lista",
        "Pode pedir uma breve descrição junto com a listagem, mas o foco é a enumeração correta e completa",
        "Testa principalmente a capacidade de memorização e organização da informação",
      ],
      criteria: [
        "O comando principal é para listar ou enumerar itens",
        "A estrutura da resposta esperada é predominantemente uma lista",
        "O detalhamento pedido para cada item é mínimo ou inexistente",
        "Frequentemente aparece como parte de uma Dissertação Estruturada, mas pode ser a questão inteira. Classificar aqui se a maioria ou a totalidade da questão for listagem",
      ],
    },
    {
      type: "COMPARACAO",
      name: "Comparação / Diferenciação Conceitual",
      description:
        "Requer que o candidato analise dois ou mais conceitos, teorias, métodos, objetos ou institutos, apontando explicitamente suas semelhanças e/ou diferenças.",
      examples: [
        "[Aborde] a diferença entre herança e polimorfismo.",
        "...redija um texto sobre as diferenças entre contrato e convênio, conceituando-os [...] e diferenciando-os...",
        "Pede para diferenciar clima e cultura organizacional.",
      ],
      characteristics: [
        "Verbos como 'comparar', 'diferenciar', 'distinguir', 'apontar semelhanças e diferenças'",
        "Foco na análise relacional entre dois ou more elementos",
        "Exige clareza na identificação dos pontos de contato e de distinção",
        "A resposta deve ser estruturada em torno da comparação/diferenciação",
      ],
      criteria: [
        "Comando explícito para comparar ou diferenciar",
        "O objeto da questão são dois ou mais elementos a serem analisados lado a lado",
        "A resposta deve focar nos pontos de semelhança e/ou diferença",
      ],
    },
    {
      type: "NAO_DISCURSIVA",
      name: "Questão Não Discursiva ou Mal Formulada",
      description:
        "Categoria residual para questões que, devido a erros de formatação nos dados, não são discursivas (ex: parecem ser de múltipla escolha, verdadeiro/falso) ou cujo comando é tão ambíguo, incompleto, contraditório ou incompreensível que impede uma classificação clara em qualquer um dos outros tipos definidos.",
      examples: [
        "Uma questão que contenha apenas alternativas (A, B, C, D) sem um comando claro de dissertação",
        "Uma questão com um comando como 'Discorra sobre.' sem especificar o tema",
        "Uma questão que apresente informações contraditórias que impossibilitem uma resposta coerente",
      ],
      characteristics: [
        "Ausência de comando claro para produção textual discursiva",
        "Presença de elementos típicos de questões objetivas (alternativas)",
        "Comando vago, ambíguo ou incompleto",
        "Informações de base contraditórias ou insuficientes para permitir uma resposta estruturada",
      ],
      criteria: [
        "Não se encaixa em nenhum dos outros 12 tipos",
        "Apresenta características claras de questão objetiva mal formatada",
        "O comando é indecifrável ou excessivamente ambíguo/incompleto",
      ],
    } as {
      type: string;
      name: string;
      description: string;
      examples: string[];
      characteristics: string[];
      criteria: string[];
    },
  ],
};

export function getQuestionTypeDefinition(questionType: string): string {
  return JSON.stringify(
    descriptions.questionTypes.find((q) => q.type === questionType) || ""
  );
}

export function getQuestionTypeName(questionType: string): string {
  return (
    descriptions.questionTypes.find((q) => q.type === questionType)?.name || ""
  );
}

export function getQuestionTypes(): [string, ...string[]] {
  return descriptions.questionTypes.map((q) => q.type) as [string, ...string[]];
}
