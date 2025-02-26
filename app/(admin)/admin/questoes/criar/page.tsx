import { QuestionForm } from "@/app/ui/admin/QuestionForm";

export default function Page() {
  return (
    <div className="container py-10 px-10">
      <h1 className="text-3xl font-bold mb-6">Criar Nova Questão</h1>
      <QuestionForm />
    </div>
  );
}
