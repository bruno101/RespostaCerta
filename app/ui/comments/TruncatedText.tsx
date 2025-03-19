import { useEffect, useRef, useState } from "react";

export default function TruncatedText({
  text,
  small,
}: {
  text: string;
  small: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current && textRef) {
      const maxHeight =
        10 * parseFloat(getComputedStyle(textRef.current).lineHeight);
      setIsTruncated((textRef.current as any).scrollHeight > maxHeight);
    }
  }, [text]);
  return (
    <>
      <div
        className={`${
          small
            ? "mt-3 sm:mt-5 text-[14px] break-all"
            : "mt-5 sm:mt-10 text-[15px]"
        } mx-5 break-all rich-text-editor`}
        ref={textRef}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: isExpanded ? "unset" : 10,
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      {isTruncated && !isExpanded && (
        <button
          className={`ml-5 break-all mt-2 ${
            small ? "text-[13px]" : "text-[14px]"
          } font-bold text-slate-500`}
          onClick={() => setIsExpanded(true)}
        >
          Mostrar comentário completo
        </button>
      )}
      {isTruncated && isExpanded && (
        <button
          className={`ml-5 mt-2 break-all ${
            small ? "text-[13px]" : "text-[14px]"
          } font-bold text-slate-500`}
          onClick={() => setIsExpanded(false)}
        >
          Mostrar menos
        </button>
      )}
    </>
  );
}
