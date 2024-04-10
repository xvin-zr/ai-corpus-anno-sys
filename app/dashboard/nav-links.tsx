"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Compass,
  FilePlus,
  FileText,
  Folder,
  Grid,
} from "react-feather";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "我的标注任务", href: "/dashboard/my-missions", icon: Folder },
  { name: "我的发布", href: "/dashboard/my-publish", icon: FileText },
  {
    name: "发布任务",
    href: "/dashboard/publish",
    icon: FilePlus,
  },
  { name: "审核任务", href: "/dashboard/my-review", icon: CheckSquare },
  {
    name: "寻找任务",
    href: "/dashboard/market",
    icon: Grid,
  },
  { name: "推荐任务", href: "/dashboard/recommend", icon: Compass },
  // { name: "历史标注记录", href: "/dashboard/history", icon: List },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-v-success-lighter/30 hover:text-blue-bupt dark:hover:bg-v-success-light/30 dark:hover:text-v-success-light md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "text-blue-bupt dark:text-v-success-light":
                  pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
