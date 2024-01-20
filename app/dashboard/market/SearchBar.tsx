"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "react-feather";
import { useDebouncedCallback } from "use-debounce";

function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((query: string): void => {
    const params = new URLSearchParams(searchParams);
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
    </>
  );
}

export default SearchBar;
