"use client";
import clsx from "clsx";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { User } from "react-feather";

function ProfileLink({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const user = session?.user;
  return (
    <Link
      href={"/dashboard/profile"}
      className={clsx(
        "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-v-success-lighter/30 hover:text-blue-bupt dark:hover:bg-v-success-light/30 dark:hover:text-v-success-light md:flex-none md:justify-start md:p-2 md:px-3",
        {
          "text-blue-bupt dark:text-v-success-light":
            pathname === "/dashboard/profile",
        },
      )}
    >
      <User />
      <div className="hidden md:block">{user ? user.name : "个人资料"}</div>
    </Link>
  );
}

export default ProfileLink;
