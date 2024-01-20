"use client";
import { usePathname } from "next/navigation";
import React from "react";

function SideNavContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <nav className="w-full flex-none bg-zinc-100 p-3 pb-0 pl-2 pt-0 dark:bg-zinc-800 md:w-60">
      {children}
    </nav>
  );
}

export default SideNavContainer;
