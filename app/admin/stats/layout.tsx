import React, { ReactNode } from "react";

function AdminStatisticsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-grow p-3 pb-0 md:overflow-y-auto md:p-6 md:pb-0">
      {children}
    </div>
  );
}

export default AdminStatisticsLayout;
