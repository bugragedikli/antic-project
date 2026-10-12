"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const inputClass =
    "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent-color)";
const labelClass = "text-md font-medium text-(--text-color)/80";

// Only allow paths on our own site
function safeRedirect(value: string | null) {
    if (value && value.startsWith("/") && !value.startsWith("//")) {
        return value;
    }
    return "/";
}


export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = safeRedirect(searchParams.get("redirect"));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (session) {
            router.replace(redirectTo);
        }
    }, [session, router, redirectTo]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");
        const rememberMe = form.get("rememberMe") === "on";

        setError("");
        setLoading(true);

        try {
            const { error: signInError } = await authClient.signIn.email({
                email,
                password,
                rememberMe,
            });

            if (signInError) {
                setError(
                    signInError.status === 429
                        ? "Too many attempts. Please wait a moment and try again."
                        : signInError.message ?? "Something went wrong. Please try again."
                );
                return;
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full mt-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className={labelClass}>E-mail</label>
                <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className={labelClass}>Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
            </div>

            <div className="flex items-center justify-between gap-1 mt-2">
                <label className="flex items-center gap-2 text-(--text-color)/80">
                    <input
                        name="rememberMe"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 accent-(--accent-color)"
                    />
                    Remember me
                </label>
                <Link href="/forgot-password" className="text-sm text-(--accent-color) hover:underline">
                    Forgot your password?
                </Link>
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-600">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-(--accent-color) text-white rounded-md px-4 py-2 hover:bg-(--accent-color)/80 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
