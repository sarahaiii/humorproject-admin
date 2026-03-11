import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewAllowedSignupDomainPage() {
    async function createDomain(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const domain = formData.get("domain")?.toString() ?? "";

        await supabase.from("allowed_signup_domains").insert({
            domain,
        });

        redirect("/admin/allowed-signup-domains");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Add Allowed Signup Domain</h1>

                <form
                    action={createDomain}
                    className="space-y-4 rounded-2xl border bg-white p-6 text-gray-900 shadow-sm"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Domain</label>
                        <input
                            name="domain"
                            placeholder="example.com"
                            className="w-full rounded-lg border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                        Create Domain
                    </button>
                </form>
            </div>
        </main>
    );
}