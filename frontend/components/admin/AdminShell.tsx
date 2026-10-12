"use client";

import { useState } from "react";
import AdminNav from "./AdminNav";
import AdminBar from "./AdminBar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="flex min-h-full w-full">
            <AdminNav expanded={expanded} />
            <div className="flex flex-1 flex-col min-h-screen bg-white">
                <AdminBar expanded={expanded} onToggle={() => setExpanded((e) => !e)} />
                <main className="bg-[#F3F3F9] flex-1">{children}</main>
            </div>
        </div>
    );
}
