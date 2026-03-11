import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewWhitelistEmailPage() {
    async function createEmail(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const email = formData.get("email")?.toString() ?? "";

        await supabase.from("whitelist_email_addresses").insert({
            email,
        });

        redirect("/admin/whitelist-emails");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Add Whitelisted Email</h1>

                <form
                    action={createEmail}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Create Email
                    </button>
                </form>
            </div>
        </main>
    );
}