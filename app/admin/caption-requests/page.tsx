import { createClient } from "@/lib/supabase/server";

type Row = {
    id: number;
    profile_id?: string | null;
    image_id?: number | null;
    created_datetime_utc?: string | null;
};

export default async function CaptionRequestsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("caption_requests")
        .select("*")
        .order("created_datetime_utc", { ascending: false })
        .limit(100);

    if (error) {
        return <main className="p-10 text-white">Error: {error.message}</main>;
    }

    const rows = data as Row[];

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-4xl font-bold text-white">
                    Caption Requests
                </h1>

                <div className="overflow-hidden rounded-xl bg-white shadow text-gray-900">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left">ID</th>
                            <th className="px-6 py-4 text-left">Profile</th>
                            <th className="px-6 py-4 text-left">Image</th>
                            <th className="px-6 py-4 text-left">Created</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y">
                        {rows?.map((r) => (
                            <tr key={r.id}>
                                <td className="px-6 py-4">{r.id}</td>
                                <td className="px-6 py-4 font-mono text-xs">{r.profile_id}</td>
                                <td className="px-6 py-4">{r.image_id}</td>
                                <td className="px-6 py-4 text-xs">
                                    {r.created_datetime_utc}
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