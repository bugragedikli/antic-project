import { cookies } from "next/headers";

// For Server Components only: forwards the browser's cookies to Express
export async function apiGet<T>(path: string): Promise<T | null> {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
}
