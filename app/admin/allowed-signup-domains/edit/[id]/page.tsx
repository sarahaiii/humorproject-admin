import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AllowedSignupDomainRow = {
    id: string | number;
    domain?: string | null;
};

export default async function EditAllowedSignupDomainPage({
                                                              params,
                                                          }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("allowed_signup_domains")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading domain: {error.message}</main>;
    }

    const row = data as AllowedSignupDomainRow;

    async function updateDomain(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const domain = formData.get("domain")?.toString() ?? "";

        await supabase.from("allowed_signup_domains").update({ domain }).eq("id", id);
        redirect("/admin/allowed-signup-domains");
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Edit Allowed Signup Domain</h1>

                <form
                    action={updateDomain}
                    className="space-y-4 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">Domain</label>
                        <input
                            name="domain"
                            defaultValue={row.domain ?? ""}
                            className="w-full rounded-lg border border-[rgba(120,175,255,0.4)] px-4 py-3 text-[#1a3a5c]"
                        />
                    </div>

                    <button className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3b82f6]">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}
