export default function welcomeToPremium(name: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Resposta Certa!</title>
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
        .features {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .features h2 {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .features ul {
            list-style-type: none;
            padding: 0;
        }
        .features ul li {
            font-size: 14px;
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        .features ul li::before {
            content: "✔";
            color: #27ae60;
            position: absolute;
            left: 0;
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
            <h1>Bem-vindo ao Resposta Certa!</h1>
            <p>Olá ${name},</p>
            <p>Estamos muito felizes em tê-lo como parte da nossa comunidade premium! Agora que o seu pagamento foi confirmado, você tem acesso completo a todos os recursos exclusivos que preparamos para você.</p>
            <div class="features">
                <h2>Confira os benefícios da sua assinatura premium:</h2>
                <ul>
                    <li>Simulados ilimitados para praticar à vontade.</li>
                    <li>Gabaritos ilimitados para conferir suas respostas.</li>
                    <li>Correções de questões por professores especializados.</li>
                    <li>Possibilidade de salvar filtros em cadernos personalizados.</li>
                </ul>
            </div>
            <p>Estamos aqui para ajudar você a alcançar os melhores resultados. Se tiver alguma dúvida ou precisar de suporte, não hesite em nos contatar.</p>
            <p>Aproveite ao máximo a sua experiência com o Resposta Certa!</p>
            <p>Atenciosamente,<br>Equipe Resposta Certa</p>
        </div>
        <div class="footer">
            <p>Se tiver alguma dúvida, visite nossa <a href="${process.env.NEXTAUTH_URL}/suporte"">central de ajuda</a> ou entre em contato conosco pelo <a href="mailto:suporte@respostacerta.com">suporte@respostacerta.com</a>.</p>
            <p>© 2025 Resposta Certa. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>`;
}
