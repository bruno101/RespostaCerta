"use client";
import { useRef, useState } from "react";
import QuestionAnswer from "./QuestionAnswer";
import UserComments from "../comments/UserComments";
import Image from "next/image";
import { useEffect } from "react";
import IQuestion from "@/app/interfaces/IQuestion";
import IComment from "@/app/interfaces/IComment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {RiQuestionAnswerLine} from "react-icons/ri"
import SubmitResponse from "./SubmitResponse";

export default function QuestionComments({
  question,
}: {
  question: IQuestion;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(-1);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (session !== undefined) {
      setSessionReady(true);
    }
    async function fetchComments() {
      try {
        const res = await fetch(`/api/questions/${question.Codigo}/comments`); // 👈 API call
        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = await res.json();
        setComments(
          data.sort((a: IComment, b: IComment) => {
            return a.likes - b.likes
              ? b.likes - a.likes
              : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime();
          })
        );
      } catch (err: any) {
        console.log(err);
      } finally {
        setCommentsLoading(false);
      }
    }

    if (session && session.user) {
      fetchComments();
    }
  }, [session]);

  useEffect(() => {
    if (activeItem !== -1 || !commentsLoading) {
      buttonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeItem, commentsLoading]);

  return (
    <div>
      <div
        className={`pt-2 ${
          activeItem != -1 ? "border-b-1" : "rounded-b-lg"
        } border-t-1 bg-slate-50 text-[14px] flex flex-row`}
      >
        <button
          onClick={() => {
            setActiveItem(0);
          }}
          ref={buttonRef}
          className={`${
            activeItem === 0 &&
            "bg-blue-200 text-cyan-800 font-bold border-b-3 border-b-blue-500 pb-2"
          } ${
            activeItem !== 1 && "hover:pb-[13px]"
          } py-4 px-5 hover:border-b-3 hover:border-b-blue-500 hover:pb-2 flex flex-row`}
        >
          <Image
            width="32"
            height="32"
            className="h-5 w-5 mr-2"
            src="https://img.icons8.com/?size=100&id=14570&format=png&color=000000"
            alt="comentários"
          />
          <p>Questão comentada</p>
          {question.Resposta && (
            <div className="w-2 h-2 ml-3 mt-2 bg-blue-500 rounded-full"></div>
          )}
        </button>
        <button
          disabled={sessionReady ? false : true}
          onClick={() => {
            if (!session) {
              router.push("/signin");
            }
            setActiveItem(1);
          }}
          className={`${
            activeItem === 1 &&
            "hover:pb-[16px] bg-blue-200 text-cyan-800 font-bold border-b-3 border-b-blue-500"
          } ${
            activeItem !== 1 && "hover:pb-[13px]"
          } py-4 px-5 hover:border-b-3 hover:border-b-blue-500 hover:pb-[13px] flex flex-row
          `}
        >
          <Image
            width="32"
            height="32"
            className="h-5 w-5 mr-2"
            src="https://img.icons8.com/windows/32/messaging-.png"
            alt="comentários"
          />
          <p>Comentários de alunos</p>
          {comments.length > 0 && (
            <div className="min-w-5 pr-[2px] h-6 ml-3 mt-[-1px] bg-cyan-700 rounded-md text-white">
              {comments.length}
            </div>
          )}
        </button>
        <button
          disabled={sessionReady ? false : true}
          onClick={() => {
            if (!session) {
              router.push("/signin");
            }
            setActiveItem(2);
          }}
          className={`${
            activeItem === 2 &&
            "hover:pb-[16px] bg-blue-200 text-cyan-800 font-bold border-b-3 border-b-blue-500"
          } ${
            activeItem !== 2 && "hover:pb-[13px]"
          } py-4 px-5 hover:border-b-3 hover:border-b-blue-500 hover:pb-[13px] flex flex-row
          `}
        >
          <RiQuestionAnswerLine className="w-4 h-4 mt-[3px] mr-2"/>
          <p>Submeter Resposta</p>
          {comments.length > 0 && (
            <div className="min-w-5 pr-[2px] h-6 ml-3 mt-[-1px] bg-cyan-700 rounded-md text-white">
              {comments.length}
            </div>
          )}
        </button>
      </div>
      {activeItem != -1 && (
        <div className="py-4 px-8 bg-slate-50 rounded-b-lg flex flex-col">
          <button
            className="ml-auto mb-2"
            onClick={() => {
              setActiveItem(-1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <div>
            {activeItem === 0 && <QuestionAnswer answer={question.Resposta} />}
            {activeItem === 1 && (
              <UserComments
                questionId={question.Codigo}
                comments={[...comments]}
                setComments={setComments}
                commentsLoading={commentsLoading}
                currentUser={session?.user}
              />
            )}
            {activeItem === 2 && (
              <SubmitResponse
                questionId={question.Codigo}
                currentUser={session?.user}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
