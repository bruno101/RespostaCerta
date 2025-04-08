export default function Footer() {
  return (
    <div className="z-11 absolute w-full overflow-x-hidden bg-gradient-to-r from-cyan-600 to-purple-600 py-8 text-center text-white">
      <p className="text-sm">
        © 2025 Resposta Certa. Todos os direitos reservados.
      </p>
      <div className="mt-4 space-x-4">
        <a href="/termos" className="text-sm hover:underline">
          Termos de Serviço
        </a>
        <a href="/privacidade" className="text-sm hover:underline">
          Política de Privacidade
        </a>
        <a href="/suporte" className="text-sm hover:underline">
          Suporte
        </a>
      </div>
    </div>
  );
}
