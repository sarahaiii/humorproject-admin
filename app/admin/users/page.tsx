import { createClient } from "@/lib/supabase/server";

type UserRow = {
    id: string;
    first_name?: string | null;
    email?: string | null;
    is_superadmin?: boolean | null;
};

export default async function UsersPage() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return <main className="p-10 text-[#1a3a5c]">Error loading users: {error.message}</main>;
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-4xl font-bold text-[#0c1a2e]">Users</h1>

                <div className="overflow-hidden rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-[#1a3a5c]">
                            <thead className="bg-blue-50 text-[#6a9cbf]">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">First Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Superadmin</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                            {(users as UserRow[] | null)?.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/50">
                                    <td className="px-4 py-3">{user.id}</td>
                                    <td className="px-4 py-3">{user.first_name ?? "-"}</td>
                                    <td className="px-4 py-3">{user.email ?? "-"}</td>
                                    <td className="px-4 py-3">{user.is_superadmin ? "true" : "false"}</td>
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
