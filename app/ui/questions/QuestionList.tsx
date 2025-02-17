import { Suspense, useEffect, useState } from "react";
import Question from "./Question";

export default function QuestionList() {
  const initQuestions: {
    Disciplina: string;
    Banca: string;
    Ano: string;
    Nivel: string;
    Questao: string;
    Resposta: string;
    Criterios: string;
    TextoMotivador?: string;
    Codigo: string;
    Instituicao: string;
    Cargo: string;
  }[] = [];

  const [questions, setQuestions] = useState(initQuestions);

  useEffect(()=>{
    const fetchQuestions = async() => {
      try{
        const res = await fetch('/api/questions');
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching', error);
      }
    };
    fetchQuestions();
  }, [])
  
  return (
      <div className="mt-3">
        {questions.map(
          (
            question,
            index: any
          ) => (
            <div key={index}>
              <Question question={question} index={index} />
            </div>
          )
        )}
      </div>
  );
}
