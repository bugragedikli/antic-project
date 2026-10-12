import { cookies } from "next/headers";

type statisticsType = {
    totalUsers: number;
    newUsersThisWeek: number;
    activeSessions: number;
};

type sessionType = {
    user: { firstName: string; lastName: string };
};

async function apiGet<T>(path: string): Promise<T | null> {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        // Tarayıcıdan gelen cookie'leri Express'e ilet
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function AdminPage() {
    // İki istek paralel gider, biri diğerini beklemez
    const [session, statistics] = await Promise.all([
        apiGet<sessionType>("/api/auth/get-session"),
        apiGet<statisticsType>("/api/admin/stats"),
    ]);

    return (
        <div className="p-4">
            <p>Hello, {session?.user.firstName} {session?.user.lastName}</p>
            {statistics ? (
                <div>
                    <p>Total Users: {statistics.totalUsers}</p>
                    <p>New Users This Week: {statistics.newUsersThisWeek}</p>
                    <p>Active Sessions: {statistics.activeSessions}</p>
                </div>
            ) : (
                <p>Could not load statistics.</p>
            )}
        </div>
    );
}
