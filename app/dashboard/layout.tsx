import React from "react";
import SideNav from "./SideNav";
import SideNavContainer from "./SideNavContainer";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SideNavContainer>
        <SideNav />
      </SideNavContainer>
      <div className="flex-grow p-6 pb-0 md:overflow-y-auto md:p-12 md:pb-0">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
