"use client";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { z } from "zod";

const arrowStyle =
  "hover:text-v-success dark:hover:text-v-success-light rounded-full p-1";

function Pagination({ totalPage }: { totalPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isFocus, setIsFocus] = useState(false);
  const [currPage, setCurrPage] = useState(
    parseInt(searchParams.get("page") || "1") || 1,
  );

  function createPageUrl(pageNum: number): string {
    if (pageNum < 1) {
      pageNum = 1;
    } else if (pageNum > totalPage) {
      pageNum = totalPage;
    }

    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    return `${pathname}?${params.toString()}`;
  }

  function handlePageChange(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key != "Enter") return;
    const pageNum = Number(e.currentTarget.value);
    const pageParsed = z
      .number()
      .int()
      .min(1)
      .max(totalPage)
      .safeParse(pageNum);
    if (!pageParsed.success) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    replace(`${pathname}?${params.toString()}`);
    e.currentTarget.blur();
  }

  return (
    <>
      <button
        onClick={() => {
          if (currPage == 1) return;
          replace(createPageUrl(currPage - 1));
          setCurrPage(currPage - 1);
        }}
        className={clsx(arrowStyle, {
          "pointer-events-none opacity-40": currPage == 1 || isFocus,
        })}
      >
        <ArrowLeft />
      </button>

      <input
        type="number"
        className="h-8 w-10 rounded bg-zinc-100 px-1.5 text-center ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
        min={1}
        max={totalPage}
        step={1}
        value={currPage}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setIsFocus(false);
        }}
        onChange={(e) => {
          const index = e.currentTarget.valueAsNumber;
          if (index < 1 || index > totalPage) return;
          setCurrPage(index);
        }}
        onKeyUp={(e) => {
          handlePageChange(e);
        }}
      />
      <span>/</span>
      <span>{totalPage}</span>

      <button
        onClick={() => {
          if (currPage == totalPage) return;
          replace(createPageUrl(currPage + 1));
          setCurrPage(currPage + 1);
        }}
        className={clsx(arrowStyle, {
          "pointer-events-none opacity-40": currPage == totalPage || isFocus,
        })}
      >
        <ArrowRight />
      </button>
    </>
  );
}

export default Pagination;
