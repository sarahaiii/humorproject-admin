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
        return <main className="p-10 text-white">Error loading users: {error.message}</main>;
    }

    return (
        <main className="p-12">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-4xl font-bold text-white">Users</h1>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm text-gray-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-800">
                            <thead className="bg-zinc-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">First Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Superadmin</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                            {(users as UserRow[] | null)?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-900">{user.id}</td>
                                    <td className="px-4 py-3 text-gray-900">
                                        {user.first_name ?? "-"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-900">
                                        {user.email ?? "-"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {user.is_superadmin ? "true" : "false"}
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