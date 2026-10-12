"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    // Roles are stored comma-separated, e.g. "user,admin"
    const isAdmin = session?.user.role?.split(",").includes("admin") ?? false;

    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else if (!isAdmin) {
            router.replace("/");
        }
    }, [isPending, session, isAdmin, router, pathname]);

    if (isPending || !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-(--text-color)/60">
                Loading...
            </div>
        );
    }

    return <>{children}</>;
}
