import middleware from "next-auth/middleware";

export default middleware;

// 配置 middleware 在特定路径运行
export const config = {
  matcher: ["/dashboard/:path*", "/api/auth/:path*"],
};
