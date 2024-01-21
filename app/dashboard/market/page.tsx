import { heading1Style } from "../components/header.style";
import MissionList from "./MissionList";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

async function MarketPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  console.log("searchParams:\n", searchParams);
  const query = searchParams?.query || "";
  const currPage = parseInt(searchParams?.page || "1") || 1;

  const totalPage = 3; // TODO await fetchMissionPages(query);

  return (
    <>
      <h1 className={heading1Style}>任务市场</h1>

      <section className="search-bar flex items-center justify-start space-x-2">
        <SearchBar />
      </section>

      <section className="missions-section mt-8">
        <MissionList query={query} currPage={currPage} />
      </section>

      <section
        aria-label="pagination"
        className="mt-4 flex w-full items-center justify-center gap-2 text-lg"
      >
        <Pagination totalPage={totalPage} />
      </section>
    </>
  );
}

export default MarketPage;

async function fetchMissionPages(query: string): Promise<number> {
  try {
  } catch (err) {
    console.error(err);
  }
  return NaN;
}
