import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type CaptionExampleRow = {
    id: string;
    caption?: string | null;
    example?: string | null;
};

export default async function CaptionExamplesPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("caption_examples")
        .select("*");

    if (error) {
        return (
            <main className="p-10 text-white">
                Error loading caption examples: {error.message}
            </main>
        );
    }

    const rows = data as CaptionExampleRow[] | null;

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white">Caption Examples</h1>
                    <Link
                        href="/admin/caption-examples/new"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900"
                    >
                        + Add Caption Example
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Caption</th>
                            <th className="px-6 py-4 text-left">Example</th>
                            <th className="px-6 py-4 text-left">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {rows?.map((row) => (
                            <tr key={row.id}>
                                <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                                <td className="px-6 py-4">{row.caption ?? "-"}</td>
                                <td className="px-6 py-4">{row.example ?? "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <Link
                                            href={`/admin/caption-examples/edit/${row.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <form action={`/admin/caption-examples/delete/${row.id}`}>
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