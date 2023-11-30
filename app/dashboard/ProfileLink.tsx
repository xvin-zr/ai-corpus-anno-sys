"use client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { User } from "react-feather";
import { string } from "zod";

interface Session {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

function ProfileLink() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const user = session?.user;
  return (
    <Link
      href={"/dashboard/profile"}
      className={clsx(
        "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-v-success-lighter/30 hover:text-blue-bupt dark:hover:bg-v-success-light/30 dark:hover:text-v-success-light md:flex-none md:justify-start md:p-2 md:px-3",
        {
          "text-blue-bupt": pathname === "/dashboard/profile",
        },
      )}
    >
      <User />
      {status === "loading" && (
        <span className="loading loading-dots loading-sm"></span>
      )}
      {status === "authenticated" && (
        <div className="hidden md:block">{user ? user.name : "个人资料"}</div>
      )}
    </Link>
  );
}

export default ProfileLink;
