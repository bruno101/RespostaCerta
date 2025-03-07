"use client";
import { useEffect, useState } from "react";
import Filter from "../filter/Filter";
import AppliedFilters from "../filter/AppliedFilters";
import QuestionList from "../questions/QuestionList";
import { SharedSelection } from "@heroui/system";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadingSkeletons from "../questions/LoadingSkeletons";
import ISelector from "@/app/interfaces/ISelector";

export default function HomeInnerPage({
  selectors,
  initialSelected,
}: {
  selectors: ISelector[];
  initialSelected: ISelector[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState(
    [...initialSelected].map((selection) => {
      const newSel = { ...selection };
      newSel.options = [...newSel.options];
      return newSel;
    })
  );
  const [keyWords, setKeyWords] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [filtered, setFiltered] = useState([
    ...initialSelected,
    { name: "Palavras Chave", options: [] },
  ]);

  const onFinishedLoading = () => {
    setLoadingQuestions(false);
  };

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
      !alreadyHasSelectedItems && setLoadingQuestions(true);
      alreadyHasSelectedItems = true;
    }

    const newSelected = [...selected];

    for (const item of newSelected) {
      const value = searchParams.get(item.name.toLowerCase());
      if (value) {
        !alreadyHasSelectedItems && setLoadingQuestions(true);
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
    ]);
  }, [searchParams]);

  const onSelectionChange = (name: string, keys: string[]) => {
    const nextSelected: { options: string[]; name: string }[] = [...selected].map(
      (selection) => {
        if (selection.name !== name) {
          return selection;
        } else {
          return { ...selection, options: [...keys] };
        }
      }
    );
    setSelected(nextSelected);
  };

  const onRemoveSelection = (name: string, option: string) => {
    if (name === "Palavras Chave") {
      setKeyWords("");
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
    setLoadingQuestions(true);
    let newKeyWordParams = `?palavras=${keyWords}`;
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
  return (
    <div className="w-full">
      <div className="hidden lg:w-full lg:flex lg:flex-row">
        <div className="w-[75%]">
          <Filter
            onSelectionChange={onSelectionChange}
            selected={selected}
            keyWords={keyWords}
            setKeyWords={setKeyWords}
            onFilter={onFilter}
            empty={empty}
            selectors={[...selectors]}
          />
          {loadingQuestions ? (
            <>
              <LoadingSkeletons />
              {filtered[0].options.length > 0 && (
                <QuestionList
                  loading={loadingQuestions}
                  onFinishedLoading={onFinishedLoading}
                />
              )}
              )
            </>
          ) : (
            filtered[0].options.length > 0 && (
              <QuestionList
                loading={loadingQuestions}
                onFinishedLoading={onFinishedLoading}
              />
            )
          )}
        </div>
        <div className="w-[25%]">
          <AppliedFilters
            selected={
              keyWords === ""
                ? selected
                : [{ name: "Palavras Chave", options: [keyWords] }, ...selected]
            }
            onRemoveSelection={onRemoveSelection}
          />
        </div>
      </div>
      <div className="flex flex-col w-full lg:hidden">
        <Filter
          onSelectionChange={onSelectionChange}
          selected={selected}
          keyWords={keyWords}
          setKeyWords={setKeyWords}
          onFilter={onFilter}
          empty={empty}
          selectors={[...selectors]}
        />
        {loadingQuestions ? (
          <>
            <LoadingSkeletons />
            {filtered[0].options.length > 0 && (
              <QuestionList
                loading={loadingQuestions}
                onFinishedLoading={onFinishedLoading}
              />
            )}
          </>
        ) : (
          filtered[0].options.length > 0 && (
            <QuestionList
              loading={loadingQuestions}
              onFinishedLoading={onFinishedLoading}
            />
          )
        )}
      </div>
    </div>
  );
}
