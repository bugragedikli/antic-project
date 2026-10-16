import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antic Store Admin",
  description: "This is official Antic Store Admin panel.",
};

export default function AdminLayout({ children }: LayoutProps<"/">) {
    return (
    <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
        <body suppressHydrationWarning className="h-full flex">
            <AdminGuard>
                <AdminShell>{children}</AdminShell>
            </AdminGuard>
        </body>
    </html>
    );
}
