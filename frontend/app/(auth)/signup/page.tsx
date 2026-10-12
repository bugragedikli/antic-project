import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
    title: "Signup - Antic Store",
};

export default function Signup() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
            <Link href="/">
                <h2 className="text-lg font-bold bg-(--primary-color) text-(--background-color) p-2">anticstore.com</h2>
            </Link>
            <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <p className="text-xl font-bold text-(--text-color)">Create an account</p>
                <SignupForm />
                <p className="text-sm text-(--text-color)/80 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-(--accent-color) hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
