import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type TermRow = {
    id: string;
    term?: string | null;
    definition?: string | null;
};

export default async function TermsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("terms")
        .select("*");

    if (error) {
        return <main className="p-10 text-white">Error loading terms: {error.message}</main>;
    }

    const terms = data as TermRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white">Terms</h1>
                    <Link
                        href="/admin/terms/new"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900"
                    >
                        + Add Term
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Term</th>
                            <th className="px-6 py-4 text-left">Definition</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {terms?.map((term) => (
                            <tr key={term.id}>
                                <td className="px-6 py-4 font-mono text-xs">{term.id}</td>
                                <td className="px-6 py-4">{term.term ?? "-"}</td>
                                <td className="px-6 py-4">{term.definition ?? "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <Link
                                            href={`/admin/terms/edit/${term.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <form action={`/admin/terms/delete/${term.id}`}>
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