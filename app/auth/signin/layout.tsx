import React from "react";

function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="signin-layout rounded-xl p-4">{children}</div>
  );
}

export default SignInLayout;
