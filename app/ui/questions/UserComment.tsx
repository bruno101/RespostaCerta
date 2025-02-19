import Image from "next/image";

export default function UserComment({
  comment,
}: {
  comment: {
    text: string;
    email: string;
    name: string;
    question_id: string;
    likes: Number;
    createdAt: Date;
  };
}) {
  return (
    <div className="mt-5 mb-5 shadow-md border-1 w-full rounded-xl">
      <div className="flex flex-row">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
          <Image
            src="https://avatar.iran.liara.run/public/boy?username=Ash"
            alt="Circle Image"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
        <p className="font-bold">{comment.name}</p>
        <p className="ml-auto">{comment.createdAt.toString()}</p>
      </div>
      {comment.text}
    </div>
  );
}
