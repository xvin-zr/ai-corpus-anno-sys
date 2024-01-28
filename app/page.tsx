import HeroImg from "@/public/anno-hero.jpg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="h-screen w-full px-8 py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="mx-auto overflow-hidden rounded-md object-bottom sm:w-full lg:order-last lg:aspect-[9/10]">
            <Image
              alt="AI Corpus Annotation"
              className="h-full w-full object-cover object-left shadow dark:shadow-md dark:shadow-zinc-50"
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
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-bupt px-8 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
                href="/auth/signin"
              >
                登录
              </Link>
              <Link
                className="focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 inline-flex h-10 items-center justify-center rounded-md border border-blue-bupt bg-zinc-50 px-8 text-base font-medium text-blue-bupt shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-500 dark:bg-zinc-800/70 dark:text-zinc-50 dark:hover:bg-zinc-700"
                href="/auth/signup"
              >
                注册
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
