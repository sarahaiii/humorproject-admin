import { createClient } from "@/lib/supabase/server";

export default async function CaptionsPage() {
    const supabase = await createClient();

    const { data: captions, error } = await supabase
        .from("captions")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return <div className="p-10">Error loading captions</div>;
    }

    return (
        <main className="min-h-screen bg-zinc-50 p-12">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-8 text-4xl font-bold">Captions</h1>

                <div className="rounded-xl border bg-white shadow">
                    <table className="w-full text-left">
                        <thead className="border-b bg-zinc-100">
                        <tr>
                            <th className="p-4">Caption</th>
                            <th className="p-4">Image ID</th>
                            <th className="p-4">User</th>
                        </tr>
                        </thead>

                        <tbody>
                        {captions?.map((caption) => (
                            <tr key={caption.id} className="border-b">
                                <td className="p-4">{caption.caption}</td>
                                <td className="p-4">{caption.image_id}</td>
                                <td className="p-4">{caption.user_id}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}