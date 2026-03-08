import { createClient } from "@/lib/supabase/server";

export default async function CheckAdminPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    let profile = null;
    let profileError = null;

    if (user) {
        const result = await supabase
            .from("profiles")
            .select("id, email, is_superadmin")
            .eq("id", user.id)
            .single();

        profile = result.data;
        profileError = result.error;
    }

    return (
        <main className="p-10 text-white">
            <pre>{JSON.stringify({ user, userError, profile, profileError }, null, 2)}</pre>
        </main>
    );
}