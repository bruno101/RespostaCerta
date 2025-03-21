export default function (responseUrl: string) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Questão Corrigida</h2>
    <p>Olá,</p>
    <p>Uma das questões que você submeteu foi corrigida. Clique no link abaixo para acessar a correção:</p>
    <p>
      <a 
        href="${responseUrl}" 
        style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;"
      >
        Verificar correção.
      </a>
    </p>
    <p>Atenciosamente,<br>Equipe Resposta Certa</p>
  </div>`;
}
