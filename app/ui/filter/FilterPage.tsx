"use client";
import { useEffect, useState } from "react";
import Filter from "./Filter";
import AppliedFilters from "./AppliedFilters";
import QuestionList from "../questions/QuestionList";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ISelector from "@/app/interfaces/ISelector";
import SaveFilter from "./SaveFilter";

export default function FilterPage({
  selectors,
  initialSelected,
}: {
  selectors: ISelector[];
  initialSelected: ISelector[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questionsPerPage, setQuestionsPerPage] = useState(5);
  const [pageIndex, setPageIndex] = useState(1);

  const [selected, setSelected] = useState(
    [...initialSelected].map((selection) => {
      const newSel = { ...selection };
      newSel.options = [...newSel.options];
      return newSel;
    })
  );
  const [keyWords, setKeyWords] = useState("");
  const [solved, setSolved] = useState<"" | "y" | "n">("");
  const [filtered, setFiltered] = useState([
    ...initialSelected,
    { name: "Palavras Chave", options: [] },
    { name: "Resolvidas", options: [""] },
  ]);

  const capitalize = (option: string, name: string): string => {
    const possibleOptions = selectors.filter((item) => item.name === name)[0]
      .options;
    return possibleOptions.filter(
      (possibleOption) => possibleOption.toLowerCase() === option.toLowerCase()
    )[0];
  };

  useEffect(() => {
    const keyW = searchParams.get("palavras");
    let alreadyHasSelectedItems = false;
    if (keyW) {
      setKeyWords(keyW);
      !alreadyHasSelectedItems;
      alreadyHasSelectedItems = true;
    }

    const s = searchParams.get("resolvidas");
    if (s && (s === "" || s === "y" || s === "n")) {
      setSolved(s);
      !alreadyHasSelectedItems;
      alreadyHasSelectedItems = true;
    }

    const questionsPerPage = searchParams.get("questionsPerPage");
    if (questionsPerPage) {
      setQuestionsPerPage(+questionsPerPage);
    }

    const pageIndex = searchParams.get("pageIndex");
    if (pageIndex) {
      setPageIndex(+pageIndex);
    }

    const newSelected = [...selected].map((selector) => {
      return { name: selector.name, options: [...selector.options] };
    });

    for (const item of newSelected) {
      const value = searchParams.get(item.name.toLowerCase());
      if (value) {
        !alreadyHasSelectedItems;
        alreadyHasSelectedItems = true;
        const valueArr = value.split(",");
        for (const option of valueArr) {
          const newOption = capitalize(option, item.name);

          if (!item.options.includes(newOption)) {
            item.options.push(newOption);
          }
        }
      }
    }
    setSelected(newSelected);
    setFiltered([
      ...newSelected,
      { name: "Palavras Chave", options: [keyW ? keyW : ""] },
      { name: "Resolvidas", options: [solved] },
    ]);
  }, [searchParams]);

  const onSelectionChange = (name: string, keys: string[]) => {
    const nextSelected: { options: string[]; name: string }[] = [
      ...selected,
    ].map((selection) => {
      if (selection.name !== name) {
        return selection;
      } else {
        return { ...selection, options: [...keys] };
      }
    });
    setSelected(nextSelected);
  };

  const onRemoveSelection = (name: string, option: string) => {
    if (name === "Palavras Chave") {
      setKeyWords("");
    } else if (name === "Resolvidas") {
      setSolved("");
    } else {
      const nextSelected = [...selected].map((selection) => {
        if (selection.name !== name) {
          return selection;
        } else {
          return {
            ...selection,
            options: selection.options.filter(function (item) {
              return item != option;
            }),
          };
        }
      });
      setSelected(nextSelected);
    }
  };
  const onFilter = () => {
    //setLoading(true);
    let newKeyWordParams = `?palavras=${keyWords}${
      solved && "&resolvidas=" + solved
    }&questionsPerPage=${questionsPerPage}&pageIndex=${pageIndex}`;
    for (const item of selected) {
      newKeyWordParams += `&${item.name.toLowerCase()}=${item.options.join(
        ","
      )}`;
    }
    router.replace(newKeyWordParams);
  };

  const empty = () => {
    setSelected([...initialSelected]);
  };

  const mainContent = () => {
    return (
      <>
        <Filter
          solved={solved}
          setSolved={setSolved}
          onSelectionChange={onSelectionChange}
          selected={selected}
          keyWords={keyWords}
          setKeyWords={setKeyWords}
          onFilter={onFilter}
          empty={empty}
          selectors={[...selectors]}
        />

        <QuestionList
          loading={loading}
          setLoading={setLoading}
          filtered={[...filtered]}
          questionsPerPage={questionsPerPage}
          pageIndex={pageIndex}
          router={router}
          searchParams={searchParams}
        />
        <SaveFilter filtered={[...filtered]} router={router} />
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="hidden lg:w-full lg:flex lg:flex-row">
        <div className="w-[75%] px-[50px]">{mainContent()}</div>
        <div className="w-[25%]">
          <AppliedFilters
            selected={
              keyWords === ""
                ? selected
                : [{ name: "Palavras Chave", options: [keyWords] }, ...selected]
            }
            solved={solved}
            onRemoveSelection={onRemoveSelection}
          />
        </div>
      </div>
      <div className="flex flex-col w-full lg:hidden">{mainContent()}</div>
    </div>
  );
}
