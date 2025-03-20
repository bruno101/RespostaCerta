"use client";
import { Suspense, useEffect, useState } from "react";
import LoadingSkeletons from "@/app/ui/questions/LoadingSkeletons";
import ISelector from "@/app/interfaces/ISelector";
import FilterPage from "@/app/ui/filter/FilterPage";

export default function Home() {
  const [selectors, setSelectors] = useState<ISelector[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function fetchSelectors() {
      const res = await fetch(`/api/filters`); // 👈 API call
      if (!res.ok) throw new Error("Failed to fetch selectors");
      const data: ISelector[] = await res.json();
      setSelectors(data);
    }
    fetchSelectors();
  }, []);
  useEffect(() => {
    if (selectors.length > 1) {
      setReady(true);
    }
  }, [selectors]);

  return (
    <div className="">
      <Suspense
        fallback={
          <div className="py-5">
            <LoadingSkeletons />
          </div>
        }
      >
        {ready ? (
          <FilterPage
            selectors={[...selectors]}
            initialSelected={[...selectors].map((selector) => {
              return { name: selector.name, options: [] };
            })}
          />
        ) : (
          <div className="py-5">
            <LoadingSkeletons />
          </div>
        )}
      </Suspense>
    </div>
  );
}
