"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    // Reserve the space so the navbar doesn't jump when the session loads
    if (isPending) {
        return <div className="h-9 w-48" aria-hidden />;
    }

    if (!session) {
        return (
            <div className="flex items-center gap-4 text-sm">
                <Link href="/login" className="hover:underline p-2">
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="bg-(--primary-color) hover:bg-(--primary-color)/80 px-4 py-2.5 rounded-[1px]"
                >
                    Create Account
                </Link>
            </div>
        );
    }

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    }

    return (
        <div className="flex items-center gap-4 text-sm">
            <span className="font-medium">{session.user.name}</span>
            <button type="button" onClick={handleSignOut} className="hover:underline">
                Logout
            </button>
        </div>
    );
}
