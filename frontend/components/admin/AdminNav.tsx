"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGrid, BsPerson } from "react-icons/bs";

const links = [
    { href: "/admin", label: "Dashboard", icon: BsGrid },
    { href: "/admin/users", label: "Users", icon: BsPerson },
];

function isActive(pathname: string, href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav({ expanded }: { expanded: boolean }) {
    const pathname = usePathname();

    return (
        <nav
            id="admin-sidebar"
            className={`bg-(--primary-color) text-white border-r border-gray-300 transition-[width] duration-200 ${
                expanded ? "w-64 p-4" : "w-16"
            }`}
        >
            <div className={`flex items-center justify-center text-xl font-bold mb-8 ${expanded ? 'p-0' : 'p-4'}`}>
                {expanded ? "anticstore.com" : "a"}
            </div>

            {expanded && <p className="text-sm font-medium text-gray-200/70 mb-4">Menu</p>}

            <div className="space-y-2">
                {links.map(({ href, label, icon: Icon }) => {
                    const active = isActive(pathname, href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            title={expanded ? undefined : label}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-2 px-4 py-2 text-md font-bold transition duration-200 hover:brightness-120 rounded-md ${
                                expanded ? "" : "justify-center px-0"
                            } ${active ? "bg-white/10 text-white" : "text-white/60"}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className={expanded ? "" : "sr-only"}>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
