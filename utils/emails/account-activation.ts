export default function accountActivation(verifyUrl: string) {
  return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Ativação de Conta</h2>
              <p>Olá,</p>
              <p>Você é o mais novo aluno do Resposta Certa! Para acessar o site, basta ativar agora sua conta, clicando no link abaixo.</p>
              <p>
                <a 
                  href="${verifyUrl}" 
                  style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
                >
                  Clique aqui para ativar!
                </a>
              </p>
              <p>Seja bem-vindo!</p>
              <p>Atenciosamente,<br>Equipe Resposta Certa</p>
            </div>
          `;
}
