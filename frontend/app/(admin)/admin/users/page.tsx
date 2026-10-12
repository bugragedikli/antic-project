import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { apiGet } from "@/lib/server-api";
import {
    type AdminUser,
    UserCell,
    UserRoleBadge,
    UserStatusBadge,
    formatDate,
} from "@/components/admin/UserBits";
import CreateUserButton from "@/components/admin/users/CreateUserButton";
import UserRowActions from "@/components/admin/users/UserRowActions";

type usersResponseType = {
    users: AdminUser[];
    total: number;
    page: number;
    pageSize: number;
};

type sessionType = {
    user: { id: string };
};

type AdminUsersPageProps = {
    searchParams: Promise<{ q?: string; page?: string }>;
};

// Keeps the search term when moving between pages
function pageHref(q: string, page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/admin/users?${query}` : "/admin/users";
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    const { q = "", page = "1" } = await searchParams;

    const params = new URLSearchParams({ q, page });
    const [session, data] = await Promise.all([
        apiGet<sessionType>("/api/auth/get-session"),
        apiGet<usersResponseType>(`/api/admin/users?${params}`),
    ]);

    const totalPages = data ? Math.max(Math.ceil(data.total / data.pageSize), 1) : 1;

    return (
        <div>
            <div className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
                <h1 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Users</h1>
                <p className="text-sm text-gray-500">
                    Admin <span className="mx-1">/</span> <span className="text-gray-700">Users</span>
                </p>
            </div>

            <div className="p-6">
                <div className="rounded-md bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold text-gray-800">
                            All Users
                            {data && <span className="ml-2 text-sm font-normal text-gray-500">({data.total})</span>}
                        </h3>

                        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                            {/* Plain GET form: submitting navigates to ?q=..., no client JS needed */}
                            <form action="/admin/users" className="flex flex-1 gap-2 sm:flex-none">
                                <div className="relative flex-1 sm:w-72">
                                    <BsSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        name="q"
                                        defaultValue={q}
                                        placeholder="Search name or email..."
                                        aria-label="Search users"
                                        className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-(--primary-color) focus:bg-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Search
                                </button>
                            </form>
                            <CreateUserButton />
                        </div>
                    </div>

                    {!data ? (
                        <div className="m-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            Could not load users.
                        </div>
                    ) : data.users.length === 0 ? (
                        <p className="p-5 text-sm text-gray-500">
                            {q ? <>No users match &quot;{q}&quot;.</> : "No users on this page."}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">User</th>
                                        <th className="px-5 py-3 font-medium">Joined</th>
                                        <th className="px-5 py-3 font-medium">Role</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3"><UserCell user={user} /></td>
                                            <td className="whitespace-nowrap px-5 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                                            <td className="px-5 py-3"><UserRoleBadge user={user} /></td>
                                            <td className="px-5 py-3"><UserStatusBadge user={user} /></td>
                                            <td className="px-5 py-3">
                                                <UserRowActions user={user} isSelf={user.id === session?.user.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {data && totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-sm">
                            <p className="text-gray-500">
                                Page {data.page} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                {data.page > 1 && (
                                    <Link
                                        href={pageHref(q, data.page - 1)}
                                        className="rounded-md border border-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {data.page < totalPages && (
                                    <Link
                                        href={pageHref(q, data.page + 1)}
                                        className="rounded-md border border-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
