"use client";
import { SuperCategory } from "@/constants";
import CocoCategory from "@/constants/json/coco-categories.json";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "react-feather";
import { useDebouncedCallback } from "use-debounce";

const superCategory = Object.keys(CocoCategory) as (SuperCategory | "All")[];
superCategory.unshift("All");

function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedSuperCategory, setSelectedSuperCategory] = useState<
    SuperCategory | "All"
  >("All");

  const handleSearch = useDebouncedCallback((query: string): void => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    // if (selectedSuperCategory != "")
    //   params.set("category", selectedSuperCategory);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <>
      <Search className="inline-block" />
      <input
        type="search"
        className="inline-block w-72 rounded px-2 py-1 text-lg shadow-sm ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />

      <select
        className="inline-block h-10 w-36 rounded-md px-4 py-0 shadow ring-inset focus:ring-1 focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
        id="superCategory"
        value={selectedSuperCategory}
        onChange={function handleCategory(e) {
          setSelectedSuperCategory(e.target.value as SuperCategory);
          const params = new URLSearchParams(searchParams);
          params.set("page", "1");
          if (e.target.value != "") params.set("category", e.target.value);
          replace(`${pathname}?${params.toString()}`);
        }}
      >
        {superCategory.map((sc) => (
          <option value={sc} key={sc}>
            {sc}
          </option>
        ))}
      </select>
    </>
  );
}

export default SearchBar;
