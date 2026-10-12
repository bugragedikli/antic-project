import Link from "next/link";
import type { IconType } from "react-icons";
import { BsActivity, BsPeople, BsPersonPlus } from "react-icons/bs";
import { apiGet } from "@/lib/server-api";
import {
    type AdminUser,
    UserCell,
    UserRoleBadge,
    UserStatusBadge,
    formatDate,
} from "@/components/admin/UserBits";

type statisticsType = {
    totalUsers: number;
    newUsersThisWeek: number;
    activeSessions: number;
};

type sessionType = {
    user: { firstName: string; lastName: string };
};

type listUsersType = {
    users: AdminUser[];
    total: number;
};

type StatCardProps = {
    label: string;
    value: number;
    icon: IconType;
    // Tailwind classes for the icon box, e.g. "bg-(--primary-color)/10 text-(--primary-color)"
    iconClassName: string;
    link?: { href: string; label: string };
};

function StatCard({ label, value, icon: Icon, iconClassName, link }: StatCardProps) {
    return (
        <div className="rounded-md bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
                    <h4 className="mt-4 text-2xl font-semibold text-gray-800">
                        {value.toLocaleString("en-US")}
                    </h4>
                    {link && (
                        <Link
                            href={link.href}
                            className="mt-4 inline-block text-sm text-(--primary-color) underline underline-offset-4"
                        >
                            {link.label}
                        </Link>
                    )}
                </div>
                <div className={`flex size-12 items-center justify-center rounded-md ${iconClassName}`}>
                    <Icon className="size-6" />
                </div>
            </div>
        </div>
    );
}

function RecentUsers({ users }: { users: AdminUser[] }) {
    return (
        <div className="rounded-md bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-800">Recent Users</h3>
                <Link href="/admin/users" className="text-sm text-(--primary-color) hover:underline">
                    View all
                </Link>
            </div>

            {users.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">No users yet.</p>
            ) : (
                // Table scrolls sideways on narrow screens instead of breaking the layout
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3"><UserCell user={user} /></td>
                                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                                    <td className="px-5 py-3"><UserRoleBadge user={user} /></td>
                                    <td className="px-5 py-3"><UserStatusBadge user={user} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default async function AdminPage() {
    // All requests run in parallel
    const [session, statistics, recentUsers] = await Promise.all([
        apiGet<sessionType>("/api/auth/get-session"),
        apiGet<statisticsType>("/api/admin/stats"),
        // better-auth admin plugin endpoint; it checks the admin role itself
        apiGet<listUsersType>("/api/auth/admin/list-users?sortBy=createdAt&sortDirection=desc&limit=5"),
    ]);

    return (
        <div>
            <div className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
                <h1 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Dashboard</h1>
                <p className="text-sm text-gray-500">
                    Admin <span className="mx-1">/</span> <span className="text-gray-700">Dashboard</span>
                </p>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Welcome back, {session?.user.firstName ?? "Admin"}!
                    </h2>
                    <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your store.</p>
                </div>

                {statistics ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            label="Total Users"
                            value={statistics.totalUsers}
                            icon={BsPeople}
                            iconClassName="bg-(--primary-color)/10 text-(--primary-color)"
                            link={{ href: "/admin/users", label: "View all users" }}
                        />
                        <StatCard
                            label="New Users This Week"
                            value={statistics.newUsersThisWeek}
                            icon={BsPersonPlus}
                            iconClassName="bg-(--accent-color)/15 text-(--accent-color)"
                        />
                        <StatCard
                            label="Active Sessions"
                            value={statistics.activeSessions}
                            icon={BsActivity}
                            iconClassName="bg-(--secondary-color)/10 text-(--secondary-color)"
                        />
                    </div>
                ) : (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Could not load statistics.
                    </div>
                )}

                <div className="mt-6">
                    {recentUsers ? (
                        <RecentUsers users={recentUsers.users} />
                    ) : (
                        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            Could not load recent users.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
