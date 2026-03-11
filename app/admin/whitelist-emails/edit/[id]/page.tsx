import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type WhitelistEmailRow = {
    id: string | number;
    email?: string | null;
};

export default async function EditWhitelistEmailPage({
                                                         params,
                                                     }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("whitelist_email_addresses")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return (
            <main className="p-10 text-white">
                Error loading whitelist email: {error.message}
            </main>
        );
    }

    const row = data as WhitelistEmailRow;

    async function updateEmail(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const email = formData.get("email")?.toString() ?? "";

        await supabase
            .from("whitelist_email_addresses")
            .update({ email })
            .eq("id", id);

        redirect("/admin/whitelist-emails");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Edit Whitelisted Email</h1>

                <form
                    action={updateEmail}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue={row.email ?? ""}
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}