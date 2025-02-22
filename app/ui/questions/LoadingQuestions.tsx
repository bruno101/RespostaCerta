import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingQuestions() {
  return (
    <div className="mt-20">
      {[1,2].map((_, index) => {
        return (
          <div key={index} className="flex pl-10 pr-10 flex-col mb-10">
            <div className="flex  items-center space-x-4 w-full">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-7 min-w-[250px] mr-10" />
                <Skeleton className="h-7 min-w-[200px] mr-10" />
              </div>
            </div>
            <Skeleton className="h-7 mt-2 min-w-[250px] mr-10" />
            <Skeleton className="h-7 mt-2 min-w-[250px] mr-10" />
          </div>
        );
      })}
    </div>
  );
}
