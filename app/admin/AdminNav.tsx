"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
    const pathname = usePathname();
    const isDashboard = pathname === "/admin";

    return (
        <div className="glass-card mb-8 flex items-center justify-between px-6 py-4">
            <div>
                {isDashboard ? (
                    <Link href="/" className="text-indigo-100 hover:text-white text-sm">
                        ← Back to Home
                    </Link>
                ) : (
                    <Link href="/admin" className="text-indigo-100 hover:text-white text-sm">
                        ← Back to Dashboard
                    </Link>
                )}
            </div>

            <div className="flex gap-6 text-sm text-indigo-100/80">
                <Link href="/admin/users" className="hover:text-white">
                    Users
                </Link>
                <Link href="/admin/images" className="hover:text-white">
                    Images
                </Link>
                <Link href="/admin/captions" className="hover:text-white">
                    Captions
                </Link>
                <Link href="/admin/humor-flavors" className="hover:text-white">
                    Humor Flavors
                </Link>
            </div>
        </div>
    );
}