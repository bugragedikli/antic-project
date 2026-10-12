"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { AdminUser } from "@/components/admin/UserBits";
import Modal from "./Modal";
import { FormActions, FormError, inputClassName } from "./FormBits";

const DAY = 60 * 60 * 24;

// Values are seconds, which is what better-auth's banExpiresIn expects; 0 = permanent
const DURATIONS = [
    { label: "1 day", value: DAY },
    { label: "7 days", value: 7 * DAY },
    { label: "30 days", value: 30 * DAY },
    { label: "Permanent", value: 0 },
];

type BanUserDialogProps = {
    open: boolean;
    onClose: () => void;
    user: AdminUser;
};

export default function BanUserDialog({ open, onClose, user }: BanUserDialogProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    function close() {
        setError("");
        onClose();
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const banReason = String(form.get("reason")).trim();
        const duration = Number(form.get("duration"));

        setError("");
        setPending(true);

        const { error } = await authClient.admin.banUser({
            userId: user.id,
            banReason: banReason || undefined,
            banExpiresIn: duration || undefined,
        });

        setPending(false);

        if (error) {
            setError(error.message ?? "Could not ban user.");
            return;
        }

        close();
        router.refresh();
    }

    return (
        <Modal open={open} onClose={close} title="Ban User">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{user.firstName} {user.lastName}</span> ({user.email})
                    will be signed out of every device and won&apos;t be able to sign in.
                </p>

                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Duration</span>
                    <select name="duration" defaultValue={7 * DAY} className={inputClassName}>
                        {DURATIONS.map(({ label, value }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Reason</span>
                    <textarea
                        name="reason"
                        rows={3}
                        maxLength={500}
                        placeholder="e.g. Fraudulent listings"
                        className={inputClassName}
                    />
                </label>

                <FormError message={error} />
                <FormActions onCancel={close} pending={pending} submitLabel="Ban user" danger />
            </form>
        </Modal>
    );
}
