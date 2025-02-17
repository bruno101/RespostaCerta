import { Suspense } from "react";
import FullQuestion from "./_components/FullQuestion";

const questions = [
  {
    Codigo: "Q00001",
    Disciplina: "Engenharia de Software",
    Banca: "Cebraspe",
    Ano: "2021",
    Nivel: "Superior",
    Instituicao: "TCE-RJ",
    Cargo: "Analista de Controle Externo – Tecnologia da Informação",
    TextoMotivador: `A mineração de regras de associação é um método comumente usado para explicar o que é a
    mineração de dados e o que ela é capaz de fazer. Como exemplo, tem-se o clássico caso de uma grande rede
    de supermercados norte-americana que, a partir de uma análise dos hábitos de compras dos clientes,
    descobriu uma relação estatística entre compras de cerveja e compras de fraldas. Entendeu-se, assim, que
    o motivo dessa associação era que os pais (presumidamente homens jovens), ao irem comprar fraldas para
    seus bebês (sobretudo às quintas-feiras), aproveitavam e compravam cervejas para assistir aos jogos de
    futebol em casa, uma vez que já não poderiam ir aos jogos com a mesma frequência de antes. O resultado
    disso foi que a rede de supermercados passou a oferecer um display de cervejas ao lado das fraldas para
    facilitar o consumo casado desses produtos.`,
    Questao: `Considerando que o fragmento de texto precedente tem caráter unicamente motivador, redija um texto dissertativo atendendo ao que se
    pede a seguir.<br><br>
    <div style="margin-left: 15px">
    1 <div style="margin-left: 30px; margin-top: -26px">Explique por que as regras de associação em mineração de dados são úteis para a análise da relação entre um item e outro, ainda
    que aparentemente desconexos. [valor: 6,00 pontos]</div>
    2 <div style="margin-left: 30px; margin-top: -26px"> Apresente um exemplo de contexto potencial de negócios para aplicação das regras de associação para mineração de dados e
    descreva dois dados que podem ser identificados nesse contexto. [valor: 10,00 pontos]</div>
    3 <div style="margin-left: 30px; margin-top: -26px"> Descreva uma técnica ou um algoritmo que pode ser utilizado para a aplicação de uma regra de associação de mineração
    de dados. [valor: 3,00 pontos]</div></div> `,
    Resposta: `A mineração de regras de associação visa encontrar relações (afinidades) interessantes entre variáveis (itens) em grandes
    bases de dados. Devido a sua aplicação bem-sucedida em problemas no ramo do varejo, ela também costuma ser chamada de
    análise de cesta de mercado. A principal ideia na análise de cesta de mercado é identificar fortes relações entre diferentes produtos
    (ou serviços) que costumam ser adquiridos em conjunto (aparecendo na mesma cesta de compras, seja uma cestinha física de um
    mercado, seja uma cesta virtual em um site de comércio eletrônico). Por exemplo, 65% das pessoas que adquirem seguro
    automotivo abrangente também adquirem um plano de saúde; 80% daqueles que compram livros online também compram
    música online etc. As aplicações de análise de cesta de mercado incluem: marketing cruzado, vendas cruzadas, design de lojas,
    design de catálogos, design de site de comércio eletrônico, otimização de propaganda online, precificação de produtos e
    configuração de vendas/promoções. Em essência, a análise de cesta de mercado ajuda os estabelecimentos comerciais a inferir
    necessidades e preferências dos clientes a partir de seus padrões de consumo.
    A seguir, constam exemplos de áreas/contextos de aplicação e respectivos tipos de dados/variáveis.
    • Transações de vendas: combinações de produtos adquiridos em conjunto podem ser usadas para aprimorar a
    disposição física dos produtos nas gôndolas (aproximando-se entre si produtos que se combinam) e a precificação
    promocional de produtos (não se colocando em promoção, simultaneamente, produtos que costumam ser comprados
    em conjunto).
    • Transações com cartão de crédito: compras mediante cartão de crédito proporcionam informações quanto a produtos
    que os clientes tendem a adquirir em conjunto e quanto a usos fraudulentos de números de cartão de crédito.
    • Serviços bancários: os padrões sequenciais de serviços usados pelos clientes (conferir a conta-corrente e depois a
    conta poupança) podem ser usados para identificar outros serviços que possam ser interessantes (conta de
    investimentos).
    • Produtos do setor de seguros: pacotes de produtos de seguros adquiridos por clientes (seguro automotivo seguido
    por seguro domiciliar) podem ser usados para propor produtos adicionais do setor (seguro de vida), ou combinações
    pouco usuais de solicitações de pagamento podem ser um sinal de fraude.
    • Serviços de telecomunicações: grupos de opções comumente adquiridos (como chamada em espera, identificador de
    chamadas, ligações em três linhas) ajudam a estruturar melhor pacotes de produtos para maximizar receitas; o mesmo
    é aplicável a operadoras de telecomunicação multicanais, com serviços de telefonia, televisão e Internet.
    • Registros médicos: certas combinações de enfermidades podem indicar risco elevado de várias complicações; além
    disso, certos procedimentos de tratamento em determinadas dependências médicas podem estar vinculados a alguns
    tipos de infecções. 
    Há diversos algoritmos disponíveis para a descoberta de regras de associação. Entre os mais conhecidos estão Apriori,
    Eclat e FP Growth. Esses algoritmos cumprem apenas metade do trabalho, que é identificar os conjuntos de itens frequentes na
    base de dados. Depois de identificados, os conjuntos de itens precisam ser convertidos em regras com as partes antecedente e
    consequente. A mineração de regras de associação utiliza dois parâmetros comuns: suporte, e confiança e elevação (lift). O
    algoritmo Apriori é o mais usado para a descoberta de regras de associação. Quando apresentado com um conjunto de itens
    (como conjuntos de transações no varejo, cada qual listando itens individuais adquiridos), o algoritmo busca encontrar
    subconjuntos que sejam comuns a pelo menos um número mínimo dos conjuntos de itens (isto é, obedecendo a um suporte
    mínimo).`,
    Criterios: `2.1
    0 – Não respondeu.
    1 – Explicou, de forma insuficiente, a utilidade das regras de associação em mineração de dados no contexto sugerido.
    2 – Explicou, de forma clara e suficiente, a utilidade das regras de associação em mineração de dados no contexto sugerido.
    2.2
    0 – Não apresentou nenhum contexto potencial de negócios para aplicação das regras de associação para mineração de dados.
    1 – Apenas mencionou um exemplo de contexto, mas não o descreveu nem abordou nenhum tipo de dado desse contexto.
    2 – Apresentou devidamente um exemplo de contexto, mas não descreveu nenhum tipo de dado desse contexto.
    3 – Apresentou devidamente um exemplo de contexto, mas identificou somente um tipo de dado desse contexto.
    4 – Apresentou devidamente um exemplo de contexto e identificou dois tipos de dados desse contexto.
    2.3
    0 – Não apresentou nenhuma técnica ou algoritmo de regra de associação em mineração de dados.
    1 – Apenas mencionou uma técnica ou um algoritmo de regra de associação em mineração de dados, sem descrever seu
    funcionamento.
    2 – Apresentou uma técnica ou um algoritmo de regra de associação em mineração de dados, mas descreveu de forma insuficiente
    seu funcionamento.
    3 – Apreseentou e descreveu, de forma clara e suficiente, uma técnica ou um algoritmo de regra de associação em mineração de
    dados. 
     `,
  },
  {
    Codigo: "Q00002",
    Disciplina: "Engenharia de Software",
    Banca: "Cebraspe",
    Ano: "2024",
    Nivel: "Superior",
    Cargo: "Analista Judiciário – Tecnologia da Informação",
    Instituicao: "TSE",
    Questao: `A respeito de técnicas de análise de segurança das aplicações, redija um texto dissertativo atendendo ao que se pede a seguir.    
    <br>
    <div style="margin-left: 15px">
    1 <div style="margin-left: 30px; margin-top: -26px">Explique o que é análise estática de código-fonte (SAST). [valor: 10,00 pontos]</div>
    2 <div style="margin-left: 30px; margin-top: -26px">Discorra sobre o princípio de funcionamento da SAST. [valor: 10,00 pontos]</div>
    3 <div style="margin-left: 30px; margin-top: -26px">Explique o que são testes dinâmicos de segurança (DAST). [valor: 10,00 pontos]</div>
    4 <div style="margin-left: 30px; margin-top: -26px">Discorra sobre o princípio de funcionamento do DAST. [valor: 10,00 pontos]</div>
    5 <div style="margin-left: 30px; margin-top: -26px">Identifique, justificando, qual análise entre a SAST e o DAST é considerada white box e qual é considerada black
    box. [valor: 7,50 pontos]</div></div>`,
    Resposta: `1 O teste de segurança de aplicativos estáticos (SAST), ou análise estática, é uma metodologia de teste que analisa o
    código-fonte para encontrar vulnerabilidades de segurança. As ferramentas de SAST analisam o código-fonte ou as
    versões compiladas do código quando ele não está em execução para encontrar falhas de segurança.
    2 A SAST analisa o código-fonte ou as versões compiladas do código quando ele não está em execução para encontrar
    falhas de segurança. A SAST identifica vulnerabilidades nos estágios iniciais de desenvolvimento para resolver
    rapidamente problemas sem quebrar compilações ou transmitir vulnerabilidades para a versão final do aplicativo
    quando o desenvolvedor estiver codificando o programa.
    3 O teste de segurança do aplicativo dinâmico (DAST) é um processo de teste de um aplicativo em um estado
    operacional para encontrar vulnerabilidades de segurança. As ferramentas DAST analisam programas enquanto estão
    em execução para encontrar vulnerabilidades de segurança.
    4 O DAST funciona simulando ataques automatizados em um aplicativo, imitando um invasor malicioso. O objetivo é
    encontrar resultados que não eram esperados e, portanto, poderiam ser usados por invasores para comprometer um
    aplicativo.
    5 A SAST é uma análise white box, ou teste de caixa branca, pois tem acesso ao código-fonte. O DAST, por sua vez, é
    uma análise black box, pois examina o estado de execução de uma aplicação sem conhecer o seu código-fonte.`,
    Criterios: `QUESITO 2.1 Definição de SAST
    Conceito 0 – Não respondeu ou respondeu de maneira totalmente equivocada.
    Conceito 1 – Definiu SAST de maneira parcialmente correta.
    Conceito 2 – Definiu SAST corretamente.
    QUESITO 2.2 Princípio de funcionamento da SAST
    Conceito 0 – Não respondeu ou respondeu de maneira totalmente equivocada.
    Conceito 1 – Apresentou, de maneira parcialmente correta, o princípio de funcionamento da SAST.
    Conceito 2 – Apresentou, de maneira totalmente correta, o princípio de funcionamento da SAST.
    QUESITO 2.3 Definição de DAST
    Conceito 0 – Não respondeu ou respondeu de maneira totalmente equivocada.
    Conceito 1 – Definiu DAST de maneira parcialmente correta.
    Conceito 2 – Definiu DAST corretamente.
    QUESITO 2.4 Princípio de funcionamento do DAST
    Conceito 0 – Não respondeu ou respondeu de maneira totalmente equivocada.
    Conceito 1 – Apresentou, de maneira parcialmente correta, o princípio de funcionamento do DAST.
    Conceito 2 – Apresentou, de maneira totalmente correta, o princípio de funcionamento do DAST.
    QUESITO 2.5 Identificação de SAST e DAST em white box e black box
    Conceito 0 – Não respondeu ou respondeu de maneira totalmente equivocada.
    Conceito 1 – Apresentou a classificação correta para white box ou para black box.
    Conceito 2 – Apresentou a classificação correta para white box e para black box. `,
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const question = questions.filter(q => q.Codigo===codigo)[0]
  return (
    <div className="">
      <Suspense fallback={<h1>Carregando...</h1>}>
        <FullQuestion question={question} />
      </Suspense>
    </div>
  );
}
