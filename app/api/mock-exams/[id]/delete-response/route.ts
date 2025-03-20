import Exam from "@/app/models/Exam";
import UserExam from "@/app/models/UserExam";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
/*Exemplos de ameaças comuns incluem phishing, ramsomware, ddos, injeção, ataques xss, ataques csrf etc.
Phishing ocorre quando um atacante tenta enganar o usuário ao se comunicar com ele por meio de emails, sms etc. Ele procura criar um senso de urgência, frequentemente tenta se passar por outra pessoa ou organização e pode buscar levar o usuário a sites enganosos. Para a prevenção é necessário que o usuários estejam cientes dos riscos ao usar sistemas potencialmente vítimas de phishing, mantenham-se atentos aos domínios ou números dos quais recebem comunicações e evitem clicar em links suspeitos.
Ramsoware envolve a criptografia de dados do dispositivo do usuário. O criminoso torna assim os dados indisponíveis e pode demandar uma recompensa financeira para disponizá-los de novo. A prevenção envolve medidas como backups e ações gerais de proteção contra arquivos maliciosos.
DDoS possui como objetivo afetar a disponibilidade de um sistema, normalmente pelo envio de uma quantidade excessiva de requisições fraudulentas, sobrecarregando servidores. Pode ser distribuído, e frequentemente é difícil diferenciar as requisições fraudulentas das legítimas. Para se prevenir é necessário que servidores implementem limites de requisições e ferramentas para bloqueio de tráfego suspeito.
A implementação de políticas de segurança é importante para que, por meio de controles e de ações de análise de riscos e gerenciamento de sistemas de segurança da informação, organizações tornem-se mais resilientes e resistentes contra ameaças. Tais políticas servem de referência para guiar organizações e instituições, viabilizando a tomada de medidas e a proliferação de boas práticas. A conscientização dos usuários é importante para que eles estejam cientes dos riscos e sejam capazes de evitar situações arriscadas. Sem conscientização e educação, não apenas usuários individualmente, como as instituições como um todo serão vulneráveis às ameaças.*/
/*A proteção de dados em ambientes de nuvem envolve desafios específicos, como a responsabilidade compartilhada entre provedores de nuvem e clientes. O provedor é responsável pela segurança da infraestrutura, enquanto o cliente deve proteger seus dados, aplicativos e configurações. As melhores práticas incluem:
Gerenciamento de identidades e acessos: Implementar autenticação multifator e políticas de acesso baseadas no princípio do menor privilégio para limitar o acesso a dados sensíveis.
Monitoramento contínuo: Utilizar ferramentas de monitoramento para detectar atividades suspeitas e responder rapidamente a incidentes.
As ameaças comuns em ambientes de nuvem incluem:

Vazamentos de dados: Podem ocorrer devido a configurações incorretas de permissões ou falhas humanas. A mitigação envolve a revisão regular de configurações e a educação dos usuários.
*/
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    console.log("delete response", id);
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    await connectToDatabase();
    const exam = await Exam.findOne({ _id: id });
    if (!exam) {
      return NextResponse.json(
        { error: "Simulado não encontrado" },
        { status: 404 }
      );
    }
    const userExam = await UserExam.deleteMany({
      user: session.user.email,
      exam_id: id,
    });
    if (!userExam) {
      return NextResponse.json(
        { error: "Simulado não concluído" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Resposta deletada" }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 500 });
  }
}
