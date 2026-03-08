import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_superadmin")
        .eq("id", user.id)
        .single();

    if (profileError || !profile?.is_superadmin) {
        redirect("/");
    }

    return (
        <div className="min-h-screen px-6 py-6">
            <div className="mx-auto max-w-7xl">
                <div className="glass-card mb-8 flex items-center justify-between px-6 py-4">
                    <Link href="/" className="text-indigo-100 hover:text-white">
                        ← Back to Home
                    </Link>

                    <div className="flex gap-6 text-sm text-indigo-100/80">
                        <Link href="/admin" className="hover:text-white">Dashboard</Link>
                        <Link href="/admin/users" className="hover:text-white">Users</Link>
                        <Link href="/admin/images" className="hover:text-white">Images</Link>
                        <Link href="/admin/captions" className="hover:text-white">Captions</Link>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}