import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import AuthProvider from "./auth/Provider";
import dynamic from "next/dynamic";
import { Provider } from "jotai";

const Toaster = dynamic(() => import("./Toaster"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: "AI Corpus Annotation System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body
        className={`${inter.variable} ${notoSansSC.variable} min-h-screen bg-zinc-50 font-sans dark:bg-zinc-900`}
      >
        <Provider>
          <AuthProvider>
            <main className="">{children}</main>
          </AuthProvider>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
