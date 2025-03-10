"use client";
import { Suspense, useEffect, useState } from "react";
import LoadingSkeletons from "../ui/questions/LoadingSkeletons";
import ISelector from "../interfaces/ISelector";
import HomeInnerPage from "../ui/home/HomeInnerPage";

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
    <Suspense fallback={<LoadingSkeletons />}>
      {ready ? (
        <HomeInnerPage
          selectors={[...selectors]}
          initialSelected={[...selectors].map((selector) => {
            return { name: selector.name, options: [] };
          })}
        />
      ) : <LoadingSkeletons/>}
    </Suspense>
  );
}
