import { Suspense } from "react";
import FullQuestion from "./_components/FullQuestion";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeletons from "@/app/ui/questions/LoadingSkeletons";

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
          <LoadingSkeletons/>
        }
      >
        <FullQuestion codigo={codigo} />
      </Suspense>
    </div>
  );
}
