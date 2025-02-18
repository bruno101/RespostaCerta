export default function QuestionAnswer({ answer }: { answer: string }) {
  return <div className="bg-white py-8 px-9 text-slate-800 text-[16px]"><div
  dangerouslySetInnerHTML={{ __html: answer }}
></div></div>;
}
