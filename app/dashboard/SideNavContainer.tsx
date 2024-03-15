"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React from "react";

function SideNavContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAnnotating =
    pathname.includes("/anno") || pathname.includes("/review");

  return (
    <nav
      className={clsx(
        "w-full flex-none bg-zinc-100 p-3 pb-0 pl-2 pt-0 dark:bg-zinc-800 md:w-60",
        { hidden: isAnnotating },
      )}
    >
      {!isAnnotating && children}
    </nav>
  );
}

export default SideNavContainer;
