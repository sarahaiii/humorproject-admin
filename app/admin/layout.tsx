import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "./AdminNav";

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
        redirect("/login");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, is_superadmin")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        redirect("/");
    }

    if (!profile.is_superadmin) {
        redirect("/");
    }

    return (
        <div className="min-h-screen px-6 py-6">
            <div className="mx-auto max-w-7xl">
                <AdminNav />
                {children}
            </div>
        </div>
    );
}