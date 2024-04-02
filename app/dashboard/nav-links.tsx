"use client";
import Link from "next/link";
import { Compass, FilePlus, FileText, Folder, Grid, List } from "react-feather";
import clsx from "clsx";
import { usePathname } from "next/navigation";

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
  {
    name: "寻找任务",
    href: "/dashboard/market",
    icon: Grid,
  },
  { name: "历史标注记录", href: "/dashboard/history", icon: List },
  { name: "推荐任务", href: "/dashboard/recommend", icon: Compass },
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
