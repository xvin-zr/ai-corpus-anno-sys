import Link from "next/link";
import NavLinks from "./nav-links";
import { PenTool, User } from "react-feather";
import { LogOut } from "react-feather";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function SideNav() {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-6 flex h-5 items-center justify-start rounded-md bg-blue-bupt p-4 dark:bg-v-success-dark md:h-16"
        href="/"
      >
        <div className="flex w-32 items-center justify-center gap-1 text-xl font-semibold tracking-wider text-zinc-50 md:w-40">
          语料标注 <PenTool />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="bg-gray-50 hidden h-auto w-full grow rounded-md md:block"></div>
        <form>
          <Link
            href={"/dashboard/profile"}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-v-success-lighter/30 hover:text-blue-bupt dark:hover:bg-v-success-light/30 dark:hover:text-v-success-light md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <User />
            <div className="hidden md:block">
              {session ? session.user?.name : "个人资料"}
            </div>
          </Link>
          <Link
            href={"/api/auth/signout"}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-v-error-lighter/30 hover:text-v-error dark:hover:bg-v-error-light/30 dark:hover:text-v-error-light md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LogOut />
            <div className="hidden md:block">退出</div>
          </Link>
        </form>
      </div>
    </div>
  );
}
