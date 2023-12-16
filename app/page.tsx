import Image from "next/image";
import Link from "next/link";
import HeroImg from "@/public/anno-hero.jpg";

export default function Home() {
  return (
    <section className="h-screen w-full px-8 py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="mx-auto overflow-hidden rounded-md object-bottom sm:w-full lg:order-last lg:aspect-[9/10]">
            <Image
              alt="AI Corpus Annotation"
              className="h-full w-full object-cover object-left"
              src={HeroImg}
              priority
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="-mt-16 space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
                AI 语料标注系统
              </h1>
              <p className="max-w-[600px] text-zinc-500 dark:text-zinc-400 md:text-xl">
                Enhance your AI training data with our easy-to-use annotation
                system.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                className="bg-gray-900 text-gray-50 hover:bg-gray-900/90 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300 inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
                href="/auth/signin"
              >
                Sign In
              </Link>
              <Link
                className="border-gray-200 border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-950 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
                href="/auth/signup"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
