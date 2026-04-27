import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type AllowedSignupDomainRow = {
    id: string | number;
    domain?: string | null;
    created_datetime_utc?: string | null;
};

export default async function AllowedSignupDomainsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("allowed_signup_domains")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading allowed signup domains: {error.message}</main>;
    }

    const rows = data as AllowedSignupDomainRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-[#0c1a2e]">Allowed Signup Domains</h1>
                    <Link
                        href="/admin/allowed-signup-domains/new"
                        className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                    >
                        + Add Domain
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <table className="min-w-full text-sm text-[#1a3a5c]">
                        <thead className="bg-blue-50 text-[#6a9cbf]">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Domain</th>
                            <th className="px-6 py-4 text-left">Created</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                        {rows?.map((row) => (
                            <tr key={row.id} className="hover:bg-blue-50/50">
                                <td className="px-6 py-4">{row.id}</td>
                                <td className="px-6 py-4">{row.domain ?? "-"}</td>
                                <td className="px-6 py-4 text-xs text-[#6a9cbf]">{row.created_datetime_utc ?? "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <Link href={`/admin/allowed-signup-domains/edit/${row.id}`} className="text-[#3b82f6] hover:underline">Edit</Link>
                                        <form action={`/admin/allowed-signup-domains/delete/${row.id}`}>
                                            <button className="text-red-500 hover:underline">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
