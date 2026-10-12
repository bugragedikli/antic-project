"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { type AdminUser, isAdminUser } from "@/components/admin/UserBits";
import Modal from "./Modal";
import { Field, FormActions, FormError, inputClassName } from "./FormBits";

type UserFormDialogProps = {
    open: boolean;
    onClose: () => void;
    // Omit to create a new user
    user?: AdminUser;
    // Admins can't change their own role, so they can't lock themselves out
    isSelf?: boolean;
};

export default function UserFormDialog({ open, onClose, user, isSelf = false }: UserFormDialogProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const isEdit = user !== undefined;

    function close() {
        setError("");
        onClose();
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const firstName = String(form.get("firstName")).trim();
        const lastName = String(form.get("lastName")).trim();
        const email = String(form.get("email")).trim();
        const password = String(form.get("password") ?? "");
        const role = String(form.get("role")) as "user" | "admin";

        setError("");
        setPending(true);

        const result = isEdit
            ? await updateUser(user.id, { firstName, lastName, email, role: isSelf ? undefined : role }, password)
            : await authClient.admin.createUser({
                  email,
                  password,
                  role,
                  // Required by better-auth, but our databaseHook rebuilds it from first/last name
                  name: `${firstName} ${lastName}`,
                  data: { firstName, lastName },
              });

        setPending(false);

        if (result.error) {
            setError(result.error.message ?? "Something went wrong.");
            return;
        }

        close();
        // Re-runs the Server Component so the table shows the change
        router.refresh();
    }

    return (
        <Modal open={open} onClose={close} title={isEdit ? "Edit User" : "New User"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Field label="First name" name="firstName" defaultValue={user?.firstName} required maxLength={35} />
                    <Field label="Last name" name="lastName" defaultValue={user?.lastName} required maxLength={35} />
                </div>

                <Field label="Email" name="email" type="email" defaultValue={user?.email} required />

                <Field
                    label={isEdit ? "New password" : "Password"}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required={!isEdit}
                    minLength={8}
                    maxLength={128}
                    hint={isEdit ? "Leave empty to keep the current password." : "At least 8 characters."}
                />

                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Role</span>
                    <select
                        name="role"
                        defaultValue={user && isAdminUser(user) ? "admin" : "user"}
                        disabled={isSelf}
                        className={inputClassName}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {isSelf && <span className="mt-1 block text-xs text-gray-500">You can&apos;t change your own role.</span>}
                </label>

                <FormError message={error} />
                <FormActions onCancel={close} pending={pending} submitLabel={isEdit ? "Save changes" : "Create user"} />
            </form>
        </Modal>
    );
}

type UpdateData = {
    firstName: string;
    lastName: string;
    email: string;
    role?: "user" | "admin";
};

async function updateUser(userId: string, data: UpdateData, newPassword: string) {
    // Drop role when it isn't being changed so it never reaches the API
    const { role, ...rest } = data;
    const updated = await authClient.admin.updateUser({
        userId,
        data: role ? { ...rest, role } : rest,
    });
    if (updated.error || !newPassword) return updated;

    return authClient.admin.setUserPassword({ userId, newPassword });
}
