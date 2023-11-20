
import { FilePlus, Folder, Grid, List } from "react-feather";

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
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-zinc-50 p-3 text-sm font-medium hover:bg-success-lighter/30 hover:text-blue-bupt md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
