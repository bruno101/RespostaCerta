import { Suspense } from "react";
import FullQuestion from "./_components/FullQuestion";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;

  return (
    <div className="">
      <Suspense
        fallback={
          <div className="w-[90%] flex mt-[100px] ml-auto mb-[100px] mr-auto mb-3 flex w-full">
            <Skeleton className=" h-20 w-20 rounded-full mr-5 ml-5" />
            <div className="space-y-2 w-full ">
              <Skeleton className="h-7 mt-3 min-w-[250px] mr-10" />
              <Skeleton className="h-7 min-w-[200px] mr-10" />
            </div>
          </div>
        }
      >
        <FullQuestion codigo={codigo} />
      </Suspense>
    </div>
  );
}
