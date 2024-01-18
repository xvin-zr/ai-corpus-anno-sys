import React from "react";
import { Search } from "react-feather";

function MarketPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">任务市场</h1>

      <div className="flex items-center justify-start space-x-2">
        <Search className="inline-block" />
        <input
          type="search"
          className="inline-block w-72 rounded px-2 py-1 text-lg shadow-sm ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
        />
      </div>
      <div className="">MarketPage</div>
    </>
  );
}

export default MarketPage;
