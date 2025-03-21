export default function forgotPassword(resetUrl: string) {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Redefinição de Senha</h2>
          <p>Olá,</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <p>
            <a 
              href="${resetUrl}" 
              style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
            >
              Redefinir Senha
            </a>
          </p>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
          <p>Atenciosamente,<br>Equipe Resposta Certa</p>
        </div>
      `;
}
