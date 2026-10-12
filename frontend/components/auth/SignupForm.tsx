"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const inputClass =
    "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent-color)";
const labelClass = "text-md font-medium text-(--text-color)/80";

export default function SignupForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (session) {
            router.replace("/");
        }
    }, [session, router]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") ?? "");
        const firstName = String(form.get("firstName") ?? "").trim();
        const lastName = String(form.get("lastName") ?? "").trim();
        const password = String(form.get("password") ?? "");

        setError("");
        setLoading(true);

        try {
            const { error: signUpError } = await authClient.signUp.email({
                email,
                password,
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
            });

            if (signUpError) {
                setError(signUpError.message ?? "Something went wrong. Please try again.");
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
                <label htmlFor="firstName" className={labelClass}>Name</label>
                <input id="firstName" name="firstName" type="text" autoComplete="given-name" required maxLength={35} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="lastName" className={labelClass}>Surname</label>
                <input id="lastName" name="lastName" type="text" autoComplete="family-name" required maxLength={35} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className={labelClass}>Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} className={inputClass} />
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-600">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-(--accent-color) text-white rounded-md px-4 py-2 hover:bg-(--accent-color)/80 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Creating account..." : "Sign Up with E-mail"}
            </button>
        </form>
    );
}
