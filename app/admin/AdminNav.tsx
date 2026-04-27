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
                    <Link href="/" className="text-[#6a9cbf] hover:text-[#0c1a2e] text-sm">
                        ← Back to Home
                    </Link>
                ) : (
                    <Link href="/admin" className="text-[#6a9cbf] hover:text-[#0c1a2e] text-sm">
                        ← Back to Dashboard
                    </Link>
                )}
            </div>

            <div className="flex gap-6 text-sm text-[#6a9cbf]">
                <Link href="/admin/users" className="hover:text-[#0c1a2e]">Users</Link>
                <Link href="/admin/images" className="hover:text-[#0c1a2e]">Images</Link>
                <Link href="/admin/captions" className="hover:text-[#0c1a2e]">Captions</Link>
                <Link href="/admin/humor-flavors" className="hover:text-[#0c1a2e]">Humor Flavors</Link>
            </div>
        </div>
    );
}
