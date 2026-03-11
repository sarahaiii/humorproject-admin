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
        return (
            <main className="p-10 text-white">
                Error loading allowed signup domains: {error.message}
            </main>
        );
    }

    const rows = data as AllowedSignupDomainRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white">Allowed Signup Domains</h1>

                    <Link
                        href="/admin/allowed-signup-domains/new"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900"
                    >
                        + Add Domain
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Domain</th>
                            <th className="px-6 py-4 text-left">Created</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {rows?.map((row) => (
                            <tr key={row.id}>
                                <td className="px-6 py-4">{row.id}</td>
                                <td className="px-6 py-4">{row.domain ?? "-"}</td>
                                <td className="px-6 py-4">{row.created_datetime_utc ?? "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <Link
                                            href={`/admin/allowed-signup-domains/edit/${row.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>

                                        <form action={`/admin/allowed-signup-domains/delete/${row.id}`}>
                                            <button className="text-red-600 hover:underline">
                                                Delete
                                            </button>
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