import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type ImageRow = {
    id: string;
    url?: string | null;
    created_datetime_utc?: string | null;
};

export default async function ImagesPage() {
    const supabase = await createClient();

    const { data: images, error } = await supabase
        .from("images")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return (
            <main className="p-10 text-white">
                Error loading images: {error.message}
            </main>
        );
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Images</h1>
                        <p className="mt-2 text-indigo-100/70">
                            Create, view, edit, and delete images.
                        </p>
                    </div>

                    <Link
                        href="/admin/images/new"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
                    >
                        + Add Image
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {(images as ImageRow[] | null)?.map((img) => (
                        <div
                            key={img.id}
                            className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-xl"
                        >
                            <div className="aspect-[4/3] bg-gray-100">
                                {img.url ? (
                                    <img
                                        src={img.url}
                                        alt="image preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                        No image preview
                                    </div>
                                )}
                            </div>

                            <div className="p-5 text-gray-900">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    ID
                                </p>
                                <p className="mt-2 break-all font-mono text-sm">{img.id}</p>

                                <div className="mt-5 flex items-center gap-5 text-sm font-medium">
                                    <Link
                                        href={`/admin/images/edit/${img.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>

                                    <form action={`/admin/images/delete/${img.id}`}>
                                        <button className="text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}