import { heading1Style } from "../components/header.style";
import MissionList from "./MissionList";
import SearchBar from "./SearchBar";

export const revalidate = 0;

function MarketPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  console.log("searchParams:\n", searchParams);
  const query = searchParams?.query || "";
  const currPage = Number(searchParams?.page) || 1;

  return (
    <>
      <h1 className={heading1Style}>任务市场</h1>

      <section className="search-bar flex items-center justify-start space-x-2">
        <SearchBar />
      </section>

      <section className="missions-section mt-8">
        <MissionList query={query} currPage={currPage} />
      </section>

      <section className="pagination mt-4 flex items-center justify-center">
        Pagination
      </section>
    </>
  );
}

export default MarketPage;
