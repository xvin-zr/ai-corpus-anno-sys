"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { set } from "zod";

const arrowStyle =
  "hover:text-blue-bupt dark:hover:text-v-success-light rounded-full p-1";

function Pagination({ totalPage }: { totalPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const currPage = parseInt(searchParams.get("page") || "1") || 1;

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
    let pageNum = parseInt(e.currentTarget.value);
    if (!pageNum) return;
    else if (pageNum < 1) return;
    else if (pageNum > totalPage) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    replace(`${pathname}?${params.toString()}`);
    e.currentTarget.blur();
  }

  return (
    <>
      <Link
        href={createPageUrl(currPage - 1)}
        className={clsx(arrowStyle, {
          "pointer-events-none opacity-50": currPage == 1,
        })}
      >
        <ArrowLeft />
      </Link>

      <input
        type="number"
        className="h-8 w-10 rounded bg-zinc-100 px-1.5 text-center dark:bg-zinc-800"
        min={1}
        max={totalPage}
        step={1}
        defaultValue={currPage}
        onKeyUp={(e) => {
          handlePageChange(e);
        }}
      />
      <span>/</span>
      <span>{totalPage}</span>

      <Link
        href={createPageUrl(currPage + 1)}
        className={clsx(arrowStyle, {
          "pointer-events-none opacity-50": currPage == totalPage,
        })}
      >
        <ArrowRight />
      </Link>
    </>
  );
}

export default Pagination;
