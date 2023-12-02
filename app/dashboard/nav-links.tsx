"use client";
import Link from "next/link";
import { FilePlus, Folder, Grid, List } from "react-feather";
import clsx from "clsx";
import { usePathname } from "next/navigation";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "我的标注任务", href: "/dashboard", icon: Folder },
  {
    name: "发布任务",
    href: "/dashboard/invoices",
    icon: FilePlus,
  },
  {
    name: "寻找任务",
    href: "/dashboard/",
    icon: Grid,
  },
  { name: "历史记录", href: "/dashboard/customers", icon: List },
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
