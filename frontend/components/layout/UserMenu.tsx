"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PiBasket } from "react-icons/pi";
import { BsHeart, BsChevronDown } from "react-icons/bs";
import Dropdown from "./Dropdown";

export default function UserMenu() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    // Reserve the space so the navbar doesn't jump when the session loads
    if (isPending) {
        return <div className="h-9 w-48" aria-hidden />;
    }

    if (!session) {
        return (
            <div className="flex items-center gap-0 text-sm">
                <Link href="/login" className="hover:underline p-2">
                    Login
                </Link>
                <p>|</p>
                <Link
                    href="/signup"
                    className="hover:underline p-2"
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
            <Dropdown content={session.user.name}>
                <div className="w-40 bg-white text-(--text-color) rounded-md" role="none">
                    <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-200 hover:rounded-t-md" role="menuitem">
                        Account settings
                    </Link>
                    <hr className="block text-gray-300" />
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-200 hover:rounded-b-md" role="menuitem">
                        Logout
                    </button>
                </div>
            </Dropdown>
            <Dropdown content={<BsHeart className="size-5" />} hasArrow={false}>
                <div className="w-64 p-2 bg-white text-(--text-color) rounded-md">
                    Favorite items will be displayed here.
                </div>
            </Dropdown>
            <Dropdown content={<PiBasket className="size-6" />} hasArrow={false}>
                <div className="w-64 p-2 bg-white text-(--text-color) rounded-md">
                    Shopping cart items will be displayed here.
                </div>
            </Dropdown>
        </div>
    );
}
