import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type TermRow = {
    id: string;
    term?: string | null;
    definition?: string | null;
};

export default async function TermsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("terms").select("*");

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading terms: {error.message}</main>;
    }

    const terms = data as TermRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-[#0c1a2e]">Terms</h1>
                    <Link
                        href="/admin/terms/new"
                        className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                    >
                        + Add Term
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <table className="min-w-full text-sm text-[#1a3a5c]">
                        <thead className="bg-blue-50 text-[#6a9cbf]">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Term</th>
                            <th className="px-6 py-4 text-left">Definition</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                        {terms?.map((term) => (
                            <tr key={term.id} className="hover:bg-blue-50/50">
                                <td className="px-6 py-4 font-mono text-xs text-[#6a9cbf]">{term.id}</td>
                                <td className="px-6 py-4">{term.term ?? "-"}</td>
                                <td className="px-6 py-4">{term.definition ?? "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <Link href={`/admin/terms/edit/${term.id}`} className="text-[#3b82f6] hover:underline">Edit</Link>
                                        <form action={`/admin/terms/delete/${term.id}`}>
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
