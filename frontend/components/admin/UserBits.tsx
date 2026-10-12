export type AdminUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    role?: string | null;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: string | null;
    createdAt: string;
};

export function isAdminUser(user: AdminUser) {
    // Roles are stored comma-separated, e.g. "user,admin"
    return user.role?.split(",").includes("admin") ?? false;
}

// better-auth leaves banned=true after a timed ban runs out (it clears it on the next sign-in attempt)
export function isBanActive(user: AdminUser) {
    if (!user.banned) return false;
    return !user.banExpires || new Date(user.banExpires) > new Date();
}

export function Badge({ children, className }: { children: React.ReactNode; className: string }) {
    return (
        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${className}`}>
            {children}
        </span>
    );
}

export function UserStatusBadge({ user }: { user: AdminUser }) {
    // Banned outranks verification status
    if (isBanActive(user)) {
        const until = user.banExpires ? `until ${formatDate(user.banExpires)}` : "permanently";
        const reason = user.banReason ? ` — ${user.banReason}` : "";

        return (
            <span title={`Banned ${until}${reason}`} className="cursor-help">
                <Badge className="bg-red-100 text-red-700">Banned</Badge>
            </span>
        );
    }
    if (!user.emailVerified) return <Badge className="bg-amber-100 text-amber-700">Unverified</Badge>;
    return <Badge className="bg-green-100 text-green-700">Verified</Badge>;
}

export function UserRoleBadge({ user }: { user: AdminUser }) {
    return isAdminUser(user) ? (
        <Badge className="bg-(--primary-color)/10 text-(--primary-color)">Admin</Badge>
    ) : (
        <Badge className="bg-gray-100 text-gray-600">User</Badge>
    );
}

export function UserCell({ user }: { user: AdminUser }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--primary-color)/10 text-xs font-semibold text-(--primary-color)">
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName.charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
            </div>
        </div>
    );
}

export function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
