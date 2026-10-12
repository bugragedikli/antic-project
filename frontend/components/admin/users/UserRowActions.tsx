"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsPencil, BsSlashCircle, BsUnlock } from "react-icons/bs";
import { authClient } from "@/lib/auth-client";
import { type AdminUser, isBanActive } from "@/components/admin/UserBits";
import UserFormDialog from "./UserFormDialog";
import BanUserDialog from "./BanUserDialog";

const iconButton =
    "rounded-md p-2 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40";

export default function UserRowActions({ user, isSelf }: { user: AdminUser; isSelf: boolean }) {
    const router = useRouter();
    const [dialog, setDialog] = useState<"edit" | "ban" | null>(null);
    const [unbanning, setUnbanning] = useState(false);
    const banned = isBanActive(user);

    async function handleUnban() {
        if (!confirm(`Unban ${user.firstName} ${user.lastName} (${user.email})?`)) return;

        setUnbanning(true);
        const { error } = await authClient.admin.unbanUser({ userId: user.id });
        setUnbanning(false);

        if (error) {
            alert(error.message ?? "Could not unban user.");
            return;
        }
        router.refresh();
    }

    return (
        <div className="flex justify-end gap-1">
            <button type="button" onClick={() => setDialog("edit")} title="Edit" aria-label="Edit user" className={iconButton}>
                <BsPencil className="size-4" />
            </button>

            {banned ? (
                <button
                    type="button"
                    onClick={handleUnban}
                    disabled={unbanning}
                    title="Unban"
                    aria-label="Unban user"
                    className={`${iconButton} hover:text-green-700`}
                >
                    <BsUnlock className="size-4" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setDialog("ban")}
                    // better-auth rejects self-bans too; disabling just makes it obvious
                    disabled={isSelf}
                    title={isSelf ? "You can't ban yourself" : "Ban"}
                    aria-label="Ban user"
                    className={`${iconButton} hover:text-red-600`}
                >
                    <BsSlashCircle className="size-4" />
                </button>
            )}

            <UserFormDialog open={dialog === "edit"} onClose={() => setDialog(null)} user={user} isSelf={isSelf} />
            <BanUserDialog open={dialog === "ban"} onClose={() => setDialog(null)} user={user} />
        </div>
    );
}
