"use client";

import { BsTextRight, BsArrowBarRight } from "react-icons/bs";
import { authClient } from "@/lib/auth-client";

type AdminBarProps = {
    expanded: boolean;
    onToggle: () => void;
};

export default function AdminBar({ expanded, onToggle }: AdminBarProps) {
    const { data: session } = authClient.useSession();

    return (
        <div className="flex items-center justify-between bg-white shadow-md border-b border-gray-200">
            <div>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    aria-expanded={expanded}
                    aria-controls="admin-sidebar"
                    className="cursor-pointer text-black/60 m-4"
                >
                    {expanded ? <BsTextRight className="w-6 h-6" /> : <BsArrowBarRight className="w-6 h-6" />}
                </button>
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-100 h-full px-2 mr-4">
                <p>{session?.user.firstName} {session?.user.lastName}</p>
                <div className="size-2 bg-green-600 rounded-full" />
            </div>
        </div>
    );
}
