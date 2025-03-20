import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeletons from "@/app/ui/questions/LoadingSkeletons";
import FullQuestion from "@/app/ui/questions/FullQuestion";

export default async function Page({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;

  return (
    <div className="">
      <Suspense fallback={<LoadingSkeletons />}>
        <FullQuestion codigo={codigo} />
      </Suspense>
    </div>
  );
}
