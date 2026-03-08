import { createClient } from "@/lib/supabase/server";

type CaptionRow = {
    id: string;
    caption?: string | null;
    text?: string | null;
    image_id?: string | null;
    user_id?: string | null;
};

export default async function CaptionsPage() {
    const supabase = await createClient();

    const { data: captions, error } = await supabase
        .from("captions")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return (
            <main className="p-10 text-white">
                Error loading captions: {error.message}
            </main>
        );
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Captions</h1>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm text-gray-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-800">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Caption</th>
                                <th className="px-6 py-4 font-semibold">Image ID</th>
                                <th className="px-6 py-4 font-semibold">User ID</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                            {(captions as CaptionRow[] | null)?.map((caption) => (
                                <tr key={caption.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 align-top font-mono text-xs text-gray-900">
                                        {caption.id}
                                    </td>

                                    <td className="max-w-xl px-6 py-4 align-top text-gray-900">
                                        {caption.caption ?? caption.text ?? "-"}
                                    </td>

                                    <td className="px-6 py-4 align-top font-mono text-xs text-gray-700">
                                        {caption.image_id ?? "-"}
                                    </td>

                                    <td className="px-6 py-4 align-top font-mono text-xs text-gray-700">
                                        {caption.user_id ?? "-"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}