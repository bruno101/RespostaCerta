import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DOMPurify from "isomorphic-dompurify";
import { sanitizationSettings } from "@/lib/sanitization";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    if (session.user.role !== "admin" && session.user.role !== "corretor") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const responseId = params.id;

    // Mock data for different response IDs
    const mockResponses = {
      resp1: {
        id: "resp1",
        content:
          "<p>A jurisdição é o poder do Estado de aplicar o direito ao caso concreto, com definitividade. Já a competência é a medida da jurisdição, ou seja, é a delimitação do poder jurisdicional.</p><p>A jurisdição é una e indivisível, pertencente ao Estado. A competência, por sua vez, é dividida entre os diversos órgãos do Poder Judiciário, seguindo critérios como matéria, pessoa, função, território e valor da causa.</p><p>Enquanto a jurisdição é um poder abstrato, a competência é a concretização desse poder, determinando qual juízo irá julgar determinada causa.</p>",
        status: "graded",
        createdAt: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        question: {
          id: "q1",
          title: "Qual a diferença entre jurisdição e competência?",
          content:
            "<p>Explique a diferença entre jurisdição e competência no direito processual brasileiro, citando exemplos.</p>",
          maxGrade: 10,
          banca: "CESPE",
          ano: "2022",
          instituicao: "TJ-SP",
          cargo: "Juiz de Direito",
        },
        student: {
          id: "student4",
          name: "Ana Souza",
          email: "ana.souza@example.com",
          image: "https://i.pravatar.cc/150?u=student4",
        },
        feedback: {
          grade: 8,
          comment:
            "<p>Boa resposta! Você explicou corretamente os conceitos de jurisdição e competência. Faltou apenas mencionar alguns exemplos práticos, como solicitado no enunciado. Também seria interessante abordar as questões de competência absoluta e relativa.</p>",
          createdAt: new Date(
            Date.now() - 13 * 24 * 60 * 60 * 1000
          ).toISOString(),
          evaluatedBy: {
            name: "Prof. Carlos Silva",
            image: "https://i.pravatar.cc/150?u=prof1",
          },
        },
      },
      resp2: {
        id: "resp2",
        content:
          "<p>O princípio da separação dos poderes, também conhecido como sistema de freios e contrapesos, é um dos pilares do Estado Democrático de Direito. Consiste na divisão das funções estatais entre órgãos independentes e harmônicos entre si: Legislativo, Executivo e Judiciário.</p><p>Cada poder possui funções típicas e atípicas. O Legislativo tem como função típica legislar e fiscalizar, o Executivo administrar, e o Judiciário julgar. As funções atípicas são aquelas exercidas por um poder, mas que seriam típicas de outro.</p><p>No Brasil, este princípio está previsto no art. 2º da Constituição Federal de 1988, sendo considerado cláusula pétrea, ou seja, não pode ser abolido nem mesmo por emenda constitucional.</p>",
        status: "graded",
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        question: {
          id: "q2",
          title: "Explique o princípio da separação dos poderes",
          content:
            "<p>Discorra sobre o princípio da separação dos poderes, sua origem histórica e aplicação no ordenamento jurídico brasileiro.</p>",
          maxGrade: 10,
          banca: "FGV",
          ano: "2023",
          instituicao: "PGE-RJ",
          cargo: "Procurador do Estado",
        },
        student: {
          id: "student5",
          name: "Lucas Ferreira",
          email: "lucas.ferreira@example.com",
          image: "https://i.pravatar.cc/150?u=student5",
        },
        feedback: {
          grade: 9,
          comment:
            "<p>Excelente resposta! Você abordou com clareza o conceito de separação dos poderes e sua aplicação no Brasil. A menção ao sistema de freios e contrapesos e à previsão constitucional foi muito pertinente. Para uma resposta perfeita, faltou apenas mencionar a origem histórica do princípio, conforme solicitado no enunciado, com referência a Montesquieu e sua obra 'O Espírito das Leis'.</p>",
          createdAt: new Date(
            Date.now() - 8 * 24 * 60 * 60 * 1000
          ).toISOString(),
          evaluatedBy: {
            name: "Profa. Ana Martins",
            image: "https://i.pravatar.cc/150?u=prof2",
          },
        },
      },
      resp3: {
        id: "resp3",
        content:
          "<p>Os princípios constitucionais da administração pública estão expressos no art. 37 da Constituição Federal de 1988, sendo eles: legalidade, impessoalidade, moralidade, publicidade e eficiência (LIMPE).</p><p>O princípio da legalidade determina que o administrador público só pode fazer o que a lei autoriza. A impessoalidade exige que a atuação do agente público seja imparcial, sem favorecimentos ou discriminações. A moralidade impõe que o administrador atue com honestidade e lealdade. A publicidade garante a transparência dos atos administrativos. Por fim, a eficiência busca a otimização dos resultados com o menor dispêndio de recursos possível.</p><p>Além desses princípios expressos, existem outros implícitos, como razoabilidade, proporcionalidade, segurança jurídica e interesse público.</p>",
        status: "pending",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        question: {
          id: "q3",
          title:
            "Discorra sobre os princípios constitucionais da administração pública",
          content:
            "<p>Explique os princípios constitucionais expressos da administração pública e sua aplicação prática.</p>",
          maxGrade: 10,
          banca: "VUNESP",
          ano: "2023",
          instituicao: "TJ-SP",
          cargo: "Analista Judiciário",
        },
        student: {
          id: "student1",
          name: "João Silva",
          email: "joao.silva@example.com",
          image: "https://i.pravatar.cc/150?u=student1",
        },
      },
      resp4: {
        id: "resp4",
        content:
          "<p>No caso apresentado, o servidor público utilizou seu cargo para obter vantagem pessoal, favorecendo uma empresa em processo licitatório em troca de benefícios financeiros.</p><p>Esta conduta configura ato de improbidade administrativa, nos termos da Lei nº 8.429/92, especificamente no art. 9º, que trata dos atos que importam enriquecimento ilícito. Houve violação dos princípios da moralidade, impessoalidade e legalidade.</p><p>As sanções aplicáveis incluem: perda dos bens ou valores acrescidos ilicitamente ao patrimônio, ressarcimento integral do dano, perda da função pública, suspensão dos direitos políticos de 8 a 10 anos, pagamento de multa civil e proibição de contratar com o Poder Público.</p><p>É importante ressaltar que, com a nova Lei de Improbidade (Lei nº 14.230/2021), passou-se a exigir o dolo específico para configuração do ato de improbidade, o que está claramente presente no caso em análise.</p>",
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        question: {
          id: "q4",
          title: "Analise o caso concreto sobre improbidade administrativa",
          content:
            "<p>Analise o seguinte caso: Um servidor público responsável por licitações favoreceu uma empresa em troca de vantagem financeira. Discorra sobre a configuração ou não de ato de improbidade administrativa, fundamentando sua resposta.</p>",
          maxGrade: 10,
          banca: "CEBRASPE",
          ano: "2022",
          instituicao: "MPF",
          cargo: "Analista do MPU",
        },
        student: {
          id: "student2",
          name: "Maria Oliveira",
          email: "maria.oliveira@example.com",
          image: "https://i.pravatar.cc/150?u=student2",
        },
      },
      resp6: {
        id: "resp6",
        content:
          '<p>O princípio da presunção de inocência, também conhecido como princípio da não culpabilidade, está previsto no art. 5º, LVII, da Constituição Federal, que estabelece que "ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória".</p><p>Este princípio é um dos pilares do Estado Democrático de Direito e do processo penal acusatório, garantindo que o ônus da prova cabe à acusação e não ao réu. Assim, não é o acusado que deve provar sua inocência, mas sim a acusação que deve provar sua culpa.</p><p>A presunção de inocência possui três aspectos principais: regra de tratamento, regra probatória e regra de juízo. Como regra de tratamento, impede que o réu seja equiparado ao culpado antes da sentença definitiva. Como regra probatória, atribui o ônus da prova à acusação. Como regra de juízo, impõe que a dúvida seja resolvida em favor do réu (in dubio pro reo).</p>',
        status: "pending",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        question: {
          id: "q6",
          title: "Explique o princípio da presunção de inocência",
          content:
            "<p>Discorra sobre o princípio da presunção de inocência, sua previsão constitucional e seus desdobramentos no processo penal brasileiro.</p>",
          maxGrade: 10,
          banca: "FCC",
          ano: "2023",
          instituicao: "DPE-SP",
          cargo: "Defensor Público",
        },
        student: {
          id: "student3",
          name: "Pedro Santos",
          email: "pedro.santos@example.com",
          image: "https://i.pravatar.cc/150?u=student3",
        },
      },
      resp7: {
        id: "resp7",
        content:
          "<p>O controle de constitucionalidade no Brasil é um sistema misto, que combina elementos do modelo americano (difuso) e do modelo europeu (concentrado).</p><p>No controle difuso, qualquer juiz ou tribunal pode declarar a inconstitucionalidade de uma lei ou ato normativo no caso concreto, com efeitos inter partes. Já no controle concentrado, o STF julga ações diretas com o objetivo específico de declarar a inconstitucionalidade de leis ou atos normativos, com efeitos erga omnes e vinculantes.</p><p>As principais ações do controle concentrado são: ADI (Ação Direta de Inconstitucionalidade), ADC (Ação Declaratória de Constitucionalidade), ADPF (Arguição de Descumprimento de Preceito Fundamental) e ADO (Ação Direta de Inconstitucionalidade por Omissão).</p><p>O controle pode ser preventivo, realizado antes da promulgação da lei, ou repressivo, realizado após sua entrada em vigor. O controle preventivo é exercido principalmente pelo Legislativo (Comissões de Constituição e Justiça) e pelo Executivo (veto presidencial).</p>",
        status: "graded",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        question: {
          id: "q7",
          title: "Discorra sobre o controle de constitucionalidade no Brasil",
          content:
            "<p>Explique os sistemas de controle de constitucionalidade adotados no Brasil, abordando suas características, modalidades e efeitos.</p>",
          maxGrade: 10,
          banca: "CESPE",
          ano: "2022",
          instituicao: "AGU",
          cargo: "Advogado da União",
        },
        student: {
          id: "student6",
          name: "Juliana Costa",
          email: "juliana.costa@example.com",
          image: "https://i.pravatar.cc/150?u=student6",
        },
        feedback: {
          grade: 7,
          comment:
            "<p>Boa resposta! Você abordou corretamente os principais aspectos do controle de constitucionalidade no Brasil, explicando a diferença entre o controle difuso e concentrado, bem como as principais ações do controle concentrado.</p><p>No entanto, faltou aprofundar alguns pontos importantes, como a cláusula de reserva de plenário (art. 97 da CF), o papel do Senado Federal no controle difuso (art. 52, X, da CF) e a evolução jurisprudencial sobre a teoria da transcendência dos motivos determinantes.</p><p>Além disso, seria interessante mencionar as recentes inovações trazidas pelo Código de Processo Civil de 2015, como o incidente de arguição de inconstitucionalidade e o sistema de precedentes vinculantes.</p>",
          createdAt: new Date(
            Date.now() - 4 * 24 * 60 * 60 * 1000
          ).toISOString(),
          evaluatedBy: {
            name: "Prof. Roberto Mendes",
            image: "https://i.pravatar.cc/150?u=prof3",
          },
        },
      },
    };

    // Return the mock response for the requested ID
    const mockResponse =
      mockResponses[responseId as keyof typeof mockResponses];

    if (!mockResponse) {
      return NextResponse.json(
        { error: "Resposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Error fetching response details:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes da resposta" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const responseId = params.id;
    const body = await request.json();
    const { grade, comment } = body;

    if (grade === undefined || !comment) {
      return NextResponse.json(
        { error: "Dados incompletos. Nota e comentário são obrigatórios." },
        { status: 400 }
      );
    }

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedComment = DOMPurify.sanitize(comment, sanitizationSettings);

    // Simulate a delay to mimic database operation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Feedback enviado com sucesso",
      feedback: {
        grade,
        comment: sanitizedComment,
        createdAt: new Date().toISOString(),
        evaluatedBy: {
          name: session.user.name || "Avaliador",
          image: session.user.image,
        },
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Erro ao enviar feedback" },
      { status: 500 }
    );
  }
}
