import React from "react";
import SideNav from "./SideNav";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none bg-zinc-100 p-3 pb-0 pl-2 pt-0 dark:bg-zinc-800 md:w-60">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

export default DashboardLayout;
