import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Login - Antic Store",
};

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
            <Link href="/">
                <h2 className="text-lg font-bold bg-(--primary-color) text-(--background-color) p-2">anticstore.com</h2>
            </Link>
            <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <p className="text-xl font-bold text-(--text-color)">Login</p>
                <Suspense>
                    <LoginForm />
                </Suspense>
                <p className="text-sm text-(--text-color)/80 mt-4">
                    {`Don't have an account?`}{" "}
                    <Link href="/signup" className="text-(--accent-color) hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
