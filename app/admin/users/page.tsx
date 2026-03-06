import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from("profiles")
        .select("id, first_name, email, is_superadmin, created_datetime_utc")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return (
            <main className="min-h-screen bg-zinc-50 p-12">
                <div className="mx-auto max-w-6xl rounded-2xl border bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="mt-4 text-red-600">Error loading users: {error.message}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 p-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Users</h1>
                    <p className="mt-2 text-zinc-600">Read-only view of user profiles.</p>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-zinc-100 text-sm text-zinc-700">
                            <tr>
                                <th className="px-5 py-4 font-semibold">First Name</th>
                                <th className="px-5 py-4 font-semibold">Email</th>
                                <th className="px-5 py-4 font-semibold">Superadmin</th>
                                <th className="px-5 py-4 font-semibold">Created</th>
                                <th className="px-5 py-4 font-semibold">User ID</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50">
                                    <td className="px-5 py-4">{user.first_name ?? "-"}</td>
                                    <td className="px-5 py-4">{user.email ?? "-"}</td>
                                    <td className="px-5 py-4">
                      <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                              user.is_superadmin
                                  ? "bg-green-100 text-green-700"
                                  : "bg-zinc-100 text-zinc-700"
                          }`}
                      >
                        {user.is_superadmin ? "true" : "false"}
                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {user.created_datetime_utc
                                            ? new Date(user.created_datetime_utc).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td className="max-w-[220px] truncate px-5 py-4 text-zinc-500">
                                        {user.id}
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