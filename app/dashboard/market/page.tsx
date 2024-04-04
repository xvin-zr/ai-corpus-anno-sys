import { SuperCategory } from "@/constants";
import { notFound } from "next/navigation";
import { z } from "zod";
import { heading1Style } from "../components/header.style";
import MissionList from "./MissionList";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { fetchMissionPages } from "./data";

export const dynamic = "force-dynamic";

async function MarketPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    category?: string;
  };
}) {
  console.log("searchParams:\n", searchParams);
  const query = searchParams?.query || "";
  const currPage = Number(searchParams?.page) || 1;
  const category = searchParams?.category || "All";

  const totalPage =
    (await fetchMissionPages(query, category as SuperCategory | "All")) || 1;
  console.log("\ntotalPage:\n", totalPage);

  const pageParsed = z.number().int().min(1).max(totalPage).safeParse(currPage);
  if (!pageParsed.success) {
    notFound();
  }

  return (
    <>
      <h1 className={heading1Style}>任务市场</h1>

      <section className="search-bar flex items-center justify-start space-x-2">
        <SearchBar />
      </section>

      <section className="missions-section mt-8">
        <MissionList
          query={query}
          category={category as SuperCategory | "All"}
          currPage={currPage}
          totalPage={totalPage}
        />
      </section>

      <section
        aria-label="pagination"
        className="mt-4 flex w-full items-center justify-center gap-2 text-lg"
      >
        {totalPage > 1 && <Pagination totalPage={totalPage} />}
      </section>
    </>
  );
}

export default MarketPage;
