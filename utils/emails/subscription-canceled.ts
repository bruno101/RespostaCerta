export default function subscriptionCanceled(name: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cancelamento de Assinatura - Resposta Certa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .content h1 {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777777;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://img.icons8.com/?size=100&id=mocKqJgwSoT7&format=png&color=000000" alt="Resposta Certa Logo">
        </div>
        <div class="content">
            <h1>Cancelamento de Assinatura</h1>
            <p>Olá ${name},</p>
            <p>Recebemos a solicitação de cancelamento da sua assinatura premium no <strong>Resposta Certa</strong>. Lamentamos ver você partir, mas respeitamos a sua decisão.</p>
            <p>Informamos que o cancelamento foi efetivado e você perderá o ácesso aos recursos premium, incluindo:</p>
            <ul>
                <li>Simulados ilimitados</li>
                <li>Gabaritos ilimitados</li>
                <li>Correções de questões por professores</li>
                <li>Possibilidade de salvar filtros em cadernos</li>
            </ul>
            <p>Se o cancelamento foi feito por engano ou se mudar de ideia, você pode reativar sua assinatura a qualquer momento entrando em contato conosco pelo <a href="mailto:suporte@respostacerta.com">suporte@respostacerta.com</a>.</p>
            <p>Agradecemos por ter feito parte da nossa comunidade e por ter confiado no <strong>Resposta Certa</strong> para auxiliá-lo em sua jornada de estudos. Se precisar de algo no futuro, estaremos aqui para ajudar.</p>
            <p>Atenciosamente,<br>Equipe Resposta Certa</p>
        </div>
        <div class="footer">
            <p>Dúvidas ou sugestões? Entre em contato conosco pelo <a href="mailto:suporte@respostacerta.com">suporte@respostacerta.com</a>.</p>
            <p>© 2025 Resposta Certa. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>`;
}
